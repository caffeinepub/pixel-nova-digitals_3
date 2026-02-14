import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Random "mo:core/Random";
import Blob "mo:core/Blob";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Admin types
  type Admin = {
    username : Text;
    email : Text;
    passwordHash : Text;
    createdAt : Int;
  };

  type Session = {
    adminEmail : Text;
    token : Text;
    expiresAt : Int;
  };

  // Admin storage
  let admins = Map.empty<Text, Admin>();
  let sessions = Map.empty<Text, Session>();

  let SESSION_DURATION : Int = 24 * 60 * 60 * 1_000_000_000;

  func hashPassword(password : Text) : Text {
    password.reverse();
  };

  func bootstrapAdmin() {
    let defaultEmail = "vishal957041@gmail.com";
    if (admins.size() == 0) {
      let admin : Admin = {
        username = "vishal957041";
        email = defaultEmail;
        passwordHash = hashPassword("Abhishek@2006");
        createdAt = Time.now();
      };
      admins.add(defaultEmail, admin);
    };
  };

  bootstrapAdmin();

  func generateToken() : async Text {
    let randomBlob = await Random.blob();
    let timestamp = Time.now().toText();

    let hexChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    var hexString = "";

    for (byte in randomBlob.toArray().vals()) {
      let b = byte;
      let high = b / 16;
      let low = b % 16;
      hexString #= hexChars[high.toNat()];
      hexString #= hexChars[low.toNat()];
    };

    hexString # "-" # timestamp;
  };

  func validateToken(token : ?Text) : ?Text {
    switch (token) {
      case (null) { null };
      case (?t) {
        switch (sessions.get(t)) {
          case (null) { null };
          case (?session) {
            if (Time.now() > session.expiresAt) {
              sessions.remove(t);
              null;
            } else {
              ?session.adminEmail;
            };
          };
        };
      };
    };
  };

  func requireValidToken(token : Text) : Text {
    switch (validateToken(?token)) {
      case (null) { Runtime.trap("Invalid or expired admin session token") };
      case (?adminEmail) { adminEmail };
    };
  };

  // Admin Authentication
  public shared func adminLogin(email : Text, password : Text) : async { #ok : Text; #err : Text } {
    if (email == "" or password == "") {
      return #err("Email and password are required");
    };

    switch (admins.get(email)) {
      case (null) { #err("Invalid email or password") };
      case (?admin) {
        let inputHash = hashPassword(password);
        if (inputHash != admin.passwordHash) {
          #err("Invalid email or password");
        } else {
          let token = await generateToken();
          let session : Session = {
            adminEmail = email;
            token = token;
            expiresAt = Time.now() + SESSION_DURATION;
          };
          sessions.add(token, session);
          #ok(token);
        };
      };
    };
  };

  public shared func adminLogout(token : Text) : async { #ok; #err : Text } {
    ignore requireValidToken(token);
    sessions.remove(token);
    #ok;
  };

  public type NewOrder = {
    id : Nat;
    owner : ?Principal;
    service : Text;
    fullName : Text;
    email : Text;
    whatsapp : Text;
    description : Text;
    fileUpload : Blob;
    budget : Text;
    deliveryTime : Text;
    timestamp : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  var nextOrderId = 1;
  let orders = Map.empty<Nat, NewOrder>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Order Management
  public query ({ caller }) func getOrder(id : Nat) : async NewOrder {
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Unknown id " # id.toText()) };
      case (?order) {
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        switch (order.owner, isAdmin) {
          case (?owner, _) {
            if (owner != caller and not isAdmin) {
              Runtime.trap("Unauthorized: Can only view your own orders");
            };
          };
          case (null, false) {
            Runtime.trap("Unauthorized: Can only view your own orders");
          };
          case (null, true) {};
        };
        order;
      };
    };
  };

  public query ({ caller }) func getAllOrders() : async [NewOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func createOrder(
    service : Text,
    fullName : Text,
    email : Text,
    whatsapp : Text,
    description : Text,
    fileUpload : Blob,
    budget : Text,
    deliveryTime : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create orders");
    };

    let order : NewOrder = {
      id = nextOrderId;
      owner = ?caller;
      service;
      fullName;
      email;
      whatsapp;
      description;
      fileUpload;
      budget;
      deliveryTime;
      timestamp = Time.now();
    };

    orders.add(nextOrderId, order);
    let id = nextOrderId;
    nextOrderId += 1;
    id;
  };

  // File Management (Admin Token Required)
  public shared func downloadFileWithToken(token : Text, orderId : Nat) : async { #ok : Blob; #err : Text } {
    switch (validateToken(?token)) {
      case (null) { #err("Invalid or expired admin session token") };
      case (?_) {
        switch (orders.get(orderId)) {
          case (null) { #err("Unknown order id " # orderId.toText()) };
          case (?order) { #ok(order.fileUpload) };
        };
      };
    };
  };

  public shared func deleteOrderWithToken(token : Text, id : Nat) : async { #ok; #err : Text } {
    switch (validateToken(?token)) {
      case (null) { #err("Invalid or expired admin session token") };
      case (?_) {
        switch (orders.get(id)) {
          case (null) { #err("Unknown id " # id.toText()) };
          case (?_) {
            orders.remove(id);
            #ok;
          };
        };
      };
    };
  };

  public shared func getOrderDetailWithToken(token : Text, id : Nat) : async { #ok : NewOrder; #err : Text } {
    switch (validateToken(?token)) {
      case (null) { #err("Invalid or expired admin session token") };
      case (?_) {
        switch (orders.get(id)) {
          case (null) { #err("Unknown order id " # id.toText()) };
          case (?order) { #ok(order) };
        };
      };
    };
  };

  public shared func getAllOrdersWithToken(token : Text) : async { #ok : [NewOrder]; #err : Text } {
    switch (validateToken(?token)) {
      case (null) { #err("Invalid or expired admin session token") };
      case (?_) {
        #ok(orders.values().toArray());
      };
    };
  };
};
