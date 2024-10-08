import os
from BookingSystem import db, login_manager
from flask_login import UserMixin
#from itsdangerous import URLSafeTimedSerializer
from flask import url_for
from flask_mail import Message
from BookingSystem import mail
from flask import current_app 

from itsdangerous import URLSafeTimedSerializer as Serializer


@login_manager.user_loader
def load_user(user_id):
    # Try loading a UserTraveler first, if not found, try UserTourGuide
    user = UserTraveler.query.get(int(user_id))
    if not user:
        user = UserTourGuide.query.get(int(user_id))
    return user


# USERTRAVELER DATABASE
class UserTraveler(db.Model, UserMixin):

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    #confirm_email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(50), nullable=False)
    sex = db.Column(db.String(30), nullable=False)
    nationality = db.Column(db.String(50), nullable=False) 
    password = db.Column(db.String(150), nullable=False)
    image_file = db.Column(db.String(50), nullable=False, default='default.jpg')
    confirmed = db.Column(db.Boolean, default=False)


    # This is a function about reset password
    def get_reset_token(self, expires_sec=1800):
        """Generate a reset token that expires in expires_sec seconds."""
        s = Serializer(current_app.config['SECRET_KEY'])
        return s.dumps({'user_id': self.id})
    
    @staticmethod
    def verify_reset_token(token, expires_sec=1800):
        """Verify the reset token and return the user if valid."""
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            user_id = s.loads(token, max_age=expires_sec)['user_id']
        except:
            return None
        return UserTraveler.query.get(user_id)
    
    
    def send_reset_email(self):
        token = self.get_reset_token()
         # Check if the token is generated

        msg = Message('Password Reset Request', 
                      sender=os.environ.get('MAIL_DEFAULT_SENDER'), 
                      recipients=[self.email])
        msg.body = f'''To reset your password, visit the following link:
{url_for('main.traveler_reset_token', token=token, _external=True)}

If you did not make this request, simply ignore this email and no changes will be made.
'''
        print(f"Message created: {msg}")  # Check if msg is created correctly
        mail.send(msg)  # This should work now    
        
#URLSafeTimedSerializer

    def __repr__(self):
        return f"Traveler('{self.username}', '{self.email}', '{self.image_file}')"

    def get_confirmation_token(self, expires_sec=3600):
        s = Serializer(current_app.config['SECRET_KEY'])  # Replace with your actual secret key
        return s.dumps({'user_id': self.id}, salt='traveler-email-confirm')

    @staticmethod
    def verify_confirmation_token(token, expires_sec=3600):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            # Load the user_id from the token
            user_id = s.loads(token, salt='traveler-email-confirm', max_age=expires_sec)['user_id']
            print(f"Decoded user_id: {user_id}")  # For debugging
        except Exception as e:
            print(f"Error loading token: {e}")  # For debugging
            return None
        # Query the database using the correct primary key field
        return UserTraveler.query.get(user_id) 

    # Define the email sending function
    
def send_confirmation_traveler_email(user):
    token = user.get_confirmation_token()  # Call the correct method
    msg = Message('Confirm Your Email', recipients=[user.email])
    # Inside send_confirmation_email function
    msg.body = f'''To confirm your email, visit the following link:
    {url_for('main.confirm_email', token=token, _external=True)}
    '''

    mail.send(msg)
    
    
    
    
    
    
      
# TOURGUIDE DATABASE
class UserTourGuide(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    #confirm_email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(100), nullable=False)
    sex = db.Column(db.String(30), nullable=False)
    nationality = db.Column(db.String(50), nullable=False) 
    password = db.Column(db.String(150), nullable=False)
    image_file = db.Column(db.String(50), nullable=False, default='default.jpg')
    confirmed = db.Column(db.Boolean, default=False)
    
    
    # This is a function about reset password
    def get_reset_token(self, expires_sec=1800):
        """Generate a reset token that expires in expires_sec seconds."""
        s = Serializer(current_app.config['SECRET_KEY'])
        return s.dumps({'user_id': self.id})
    
    @staticmethod
    def verify_reset_token(token, expires_sec=1800):
        """Verify the reset token and return the user if valid."""
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            user_id = s.loads(token, max_age=expires_sec)['user_id']
        except:
            return None
        return UserTourGuide.query.get(user_id)
    
    
    def send_reset_email(self):
        token = self.get_reset_token()
         # Check if the token is generated

        msg = Message('Password Reset Request', 
                      sender=os.environ.get('MAIL_DEFAULT_SENDER'), 
                      recipients=[self.email])
        msg.body = f'''To reset your password, visit the following link:
{url_for('main.tourguide_reset_token', token=token, _external=True)}

If you did not make this request, simply ignore this email and no changes will be made.
'''
        print(f"Message created: {msg}")  # Check if msg is created correctly
        mail.send(msg)  # This should work now
    
    
    


    def __repr__(self):
        return f"TourGuide('{self.username}', '{self.email}', '{self.image_file}')"
    
    
    def get_confirmation_token(self, expires_sec=3600):
        s = Serializer(current_app.config['SECRET_KEY'])  # Replace with your actual secret key
        return s.dumps({'user_id': self.id}, salt='tourguide-email-confirm')

    @staticmethod
    def verify_confirmation_token(token, expires_sec=3600):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            # Load the user_id from the token
            user_id = s.loads(token, salt='tourguide-email-confirm', max_age=expires_sec)['user_id']
            print(f"Decoded user_id: {user_id}")  # For debugging
        except Exception as e:
            print(f"Error loading token: {e}")  # For debugging
            return None
        # Query the database using the correct primary key field
        return UserTourGuide.query.get(user_id) 
    
def send_confirmation_tourguide_email(user):
    token = user.get_confirmation_token()  # Call the correct method
    msg = Message('Confirm Your Email', recipients=[user.email])
    # Inside send_confirmation_email function
    msg.body = f'''To confirm your email, visit the following link:
    {url_for('main.confirm_email', token=token, _external=True)}
    '''

    mail.send(msg)
