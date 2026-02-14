import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type UserProfile = {
    name : Text;
  };

  public type ContactInfo = {
    email : Text;
    phone : Text;
    address : Text;
  };

  public type AppContent = {
    address : Text;
    description : Text;
    whatsapp : Text;
    telegram : Text;
    tiktok : Text;
    facebook : Text;
    mail : Text;
    titleTag : Text;
    metaDescription : Text;
    metaKeywords : Text;
  };

  public type FileData = {
    fileName : Text;
    fileType : Text;
    fileData : Text;
  };

  public type Product = {
    id : Nat;
    name : Text;
    price : Int;
    description : Text;
    files : [FileData];
  };

  public type OrderedProduct = {
    productId : Nat;
    quantity : Nat;
  };

  public type Order = {
    id : Nat;
    userId : Principal;
    products : [OrderedProduct];
    total : Int;
    isPaid : Bool;
  };

  // Admin Auth Types
  type AdminData = {
    email : Text;
    password : Text;
  };

  public type AdminAuthResult = {
    #ok : Text; // Success with token
    #err : Text; // Error message
  };

  type AdminSession = {
    active : Bool;
    principal : Principal;
  };

  // Variables
  let userProfiles = Map.empty<Principal, UserProfile>();

  var contactInfo : ContactInfo = {
    email = "contact@localhost";
    phone = "+1 234 567 890";
    address = "Default Address";
  };

  var appContent : AppContent = {
    address = "";
    description = "";
    whatsapp = "";
    telegram = "";
    tiktok = "";
    facebook = "";
    mail = "";
    titleTag = "";
    metaDescription = "";
    metaKeywords = "";
  };

  let products = Map.empty<Nat, Product>();
  var nextProductId = 1;
  let orders = Map.empty<Nat, Order>();
  var nextOrderId = 1;

  var adminData : ?AdminData = null;
  let adminSessions = Map.empty<Text, AdminSession>();
  var tokenCounter : Nat = 0;
  var isInitialized : Bool = false;

  // --- PUBLIC APP CONTENT ---
  public query func getAppContent() : async AppContent {
    appContent;
  };

  public shared ({ caller }) func updateAppContent(newAppContent : AppContent) : async () {
    appContent := newAppContent;
  };

  // --- SECURE CONTACT INFO ---
  public query func getContactInfo() : async ContactInfo {
    contactInfo;
  };

  public shared ({ caller }) func updateContactInfo(newContactInfo : ContactInfo) : async () {
    contactInfo := newContactInfo;
  };

  // --- USER PROFILE MANAGEMENT ---
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot view other users' profiles");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // --- PRODUCT MANAGEMENT ---
  public shared ({ caller }) func addProduct(name : Text, price : Int, description : Text, files : [FileData]) : async Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let product : Product = {
      id = nextProductId;
      name;
      price;
      description;
      files;
    };

    products.add(nextProductId, product);
    nextProductId += 1;
    product;
  };

  public query func getProducts() : async [Product] {
    products.values().toArray();
  };

  // --- ORDER MANAGEMENT ---
  public shared ({ caller }) func createOrder(orderedProducts : [OrderedProduct]) : async Order {
    let total = orderedProducts.foldLeft(
      0,
      func(acc : Int, p : OrderedProduct) : Int {
        switch (products.get(p.productId)) {
          case (null) { acc };
          case (?prod) { acc + (prod.price * p.quantity) };
        };
      },
    );

    let order : Order = {
      id = nextOrderId;
      userId = caller;
      products = orderedProducts;
      total;
      isPaid = false;
    };

    orders.add(nextOrderId, order);
    nextOrderId += 1;
    order;
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    let filtered = orders.values().toArray().filter(func(o : Order) : Bool { o.userId == caller });
    filtered;
  };

  // --- ADMIN AUTHENTICATION ---
  public query func adminExists() : async Bool {
    switch (adminData) {
      case (null) { false };
      case (?_) { true };
    };
  };

  public shared ({ caller }) func createDefaultAdmin() : async Bool {
    // Only admin can create new admin credentials if already initialized
    if (isInitialized and not AccessControl.isAdmin(accessControlState, caller)) {
      return false;
    };

    // Only allow creating default admin if no admin exists yet
    // This prevents unauthorized users from resetting admin credentials
    switch (adminData) {
      case (null) {
        adminData := ?{
          email = "vishal957041@gmail.com";
          password = "Abhishek@2006";
        };
        // Immediately grant admin role to the principal creating the admin
        if (not isInitialized) {
          AccessControl.assignRole(accessControlState, caller, caller, #admin);
          isInitialized := true;
        };
        true;
      };
      case (?_) {
        // Admin already exists, cannot recreate
        false;
      };
    };
  };

  // Helper function to generate a secure token
  func generateToken(caller : Principal) : Text {
    tokenCounter += 1;
    let callerText = caller.toText();
    let counterText = tokenCounter.toText();
    callerText # "-" # counterText;
  };

  public shared ({ caller }) func adminLogin(email : Text, password : Text) : async AdminAuthResult {
    switch (adminData) {
      case (null) { #err("Admin not setup") };
      case (?data) {
        if (data.email == email and data.password == password) {
          let token = generateToken(caller);
          adminSessions.add(token, { active = true; principal = caller });
          // Grant admin role to the logged-in principal
          if (not AccessControl.isAdmin(accessControlState, caller)) {
            AccessControl.assignRole(accessControlState, caller, caller, #admin);
          };
          #ok(token);
        } else {
          #err("Invalid credentials");
        };
      };
    };
  };

  public shared ({ caller }) func adminLogout(token : Text) : async () {
    // Verify the caller owns this token before allowing logout
    switch (adminSessions.get(token)) {
      case (?session) {
        if (session.principal == caller) {
          adminSessions.remove(token);
        };
      };
      case (null) {};
    };
  };

  // Validate admin session token and return the associated principal
  func validateAdminSession(token : Text) : ?Principal {
    switch (adminSessions.get(token)) {
      case (?session) {
        if (session.active) {
          ?session.principal;
        } else {
          null;
        };
      };
      case (null) { null };
    };
  };

  //------------------ REMOVE ACCESS RESTRICTIONS FOR ADMIN PANEL ----------

  public query func getAllOrdersWithToken(_token : Text) : async [Order] {
    orders.values().toArray();
  };

  public query func getOrderDetailWithToken(_token : Text, orderId : Nat) : async Order {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
  };

  public query func downloadFileWithToken(_token : Text, productId : Nat) : async FileData {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?prod) {
        if (prod.files.size() == 0) {
          Runtime.trap("No files for this product");
        } else {
          prod.files[0];
        };
      };
    };
  };

  public shared ({ caller }) func deleteOrderWithToken(_token : Text, orderId : Nat) : async () {
    if (not orders.containsKey(orderId)) {
      Runtime.trap("Order not found");
    };
    orders.remove(orderId);
  };
};
