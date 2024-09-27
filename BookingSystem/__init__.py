from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt 
from flask_login  import LoginManager


db = SQLAlchemy()
bcrypt = Bcrypt()

login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'your_secret_key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Kevs@localhost:5432/postgres'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    bcrypt = Bcrypt(app)
    login_manager.init_app(app)
    
    login_manager.login_view = 'main.traveler_login'  # Change 'main.traveler_login' to your login route
    login_manager.login_message_category = 'info'  # Flash message category for unauthorized users
    

    with app.app_context():
        # Import and register the blueprint
        from BookingSystem.routes import main  # Ensure you import your blueprint
        app.register_blueprint(main)  # Register the blueprint with your app

        db.create_all()  # Create database tables

    return app

















# # Import necessary libraries and modules
# from flask import Flask  # Main Flask application framework
# from flask_sqlalchemy import SQLAlchemy  # SQLAlchemy for database management
# from flask_bcrypt import Bcrypt  # Bcrypt for password hashing
# from flask_login import LoginManager  # Flask-Login for user session management

# # Initialize SQLAlchemy and Bcrypt instances
# db = SQLAlchemy()  # SQLAlchemy object for database operations
# bcrypt = Bcrypt()  # Bcrypt object for handling password hashing

# # Initialize LoginManager for handling user sessions
# login_manager = LoginManager()

# def create_app():
#     """
#     Function to create and configure the Flask application.
#     """
#     app = Flask(__name__)  # Create a new Flask application instance
#     app.config['SECRET_KEY'] = 'your_secret_key'  # Set a secret key for session management and CSRF protection
#     app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Kevs@localhost:5432/postgres'  # Database connection URI
#     app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable track modifications to save resources

#     db.init_app(app)  # Initialize the SQLAlchemy instance with the app
#     bcrypt.init_app(app)  # Initialize Bcrypt with the app
#     login_manager.init_app(app)  # Initialize the LoginManager with the app
    
#     # Set the view to redirect to for login when a user tries to access protected routes
#     login_manager.login_view = 'main.traveler_login'  # Change 'main.traveler_login' to your login route
#     login_manager.login_message_category = 'info'  # Set flash message category for unauthorized access messages

#     # Create an application context for database operations and blueprint registration
#     with app.app_context():
#         # Import and register the blueprint
#         from BookingSystem.routes import main  # Import the main blueprint containing routes
#         app.register_blueprint(main)  # Register the blueprint with the app

#         db.create_all()  # Create all database tables defined by the models

#     return app  # Return the configured Flask application instance


















