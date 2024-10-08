
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt 
from flask_login  import LoginManager
from flask_mail import Mail




db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = '2770d4fd598f5a792ebce414a891f412'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Kevs@localhost:5432/postgres'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Use your email provider's SMTP server
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    #app.config['MAIL_USERNAME'] = os.environ.get('EMAIL_USER')
    #app.config['MAIL_PASSWORD'] = os.environ.get('EMAIL_PASSWORD')
    #app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER')
    app.config['MAIL_USERNAME'] = 'kf515335@gmail.com'  # Replace with your email
    app.config['MAIL_PASSWORD'] = 'rsjptgkiwfqrxtwx'  # Replace with your email password
    app.config['MAIL_DEFAULT_SENDER'] = 'kf515335@gmail.com'  # Replace with your email
    

    db.init_app(app)
    bcrypt.init_app(app)
    
    mail.init_app(app)
    login_manager.init_app(app)
    
    login_manager.login_view = 'main.traveler_login'  # Change 'main.traveler_login' to your login route
    login_manager.login_message_category = 'info'  # Flash message category for unauthorized users
    

    with app.app_context():
        # Import and register the blueprint
        from BookingSystem.routes import main  # Ensure you import your blueprint
        app.register_blueprint(main)  # Register the blueprint with your app

        db.create_all()  # Create database tables

    return app




































