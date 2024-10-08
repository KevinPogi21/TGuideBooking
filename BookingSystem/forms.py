from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from BookingSystem.models import UserTraveler, UserTourGuide
from wtforms import ValidationError

#  VALIDATORS FOR STRONG PASSWORD
def UppercaseValidator(form, field):
    """Validates that the field contains at least one uppercase letter."""
    if not any(char.isupper() for char in field.data):
        raise ValidationError('Password must contain at least one uppercase letter.')

def LowercaseValidator(form, field):
    """Validates that the field contains at least one lowercase letter."""
    if not any(char.islower() for char in field.data):
        raise ValidationError('Password must contain at least one lowercase letter.')

def DigitalValidator(form, field):
    """Validates that the field contains at least one digit."""
    if not any(char.isdigit() for char in field.data):
        raise ValidationError('Password must contain at least one digit.')

def SpecialCharacterValidator(form, field):
    """Validates that the field contains at least one special character."""
    if not any(char in "!@#$%^&*()_+-=[]{}|;':,.<>?/" for char in field.data):
        raise ValidationError('Password must contain at least one special character.')


# REGISTRATION AND LOGIN FORM FOR TRAVELER
class TravelerRegistrationForm(FlaskForm):
    email_address = StringField('Email Address', validators=[DataRequired(), Length(min=6, max=254)])
    #confirm_email = StringField('Confirm Email', validators=[DataRequired(), Email(), EqualTo('email_address', message='Emails must match')])
    username = StringField('Username', validators=[DataRequired()])
    sex = SelectField('Sex', choices=[('male', 'Male'), ('female', 'Female')], validators=[DataRequired()])
    nationality = SelectField('Nationality', choices=[        ('Philippines', 'Philippines'),
        ('United States', 'United States'),
        ('Japan', 'Japan'),
        ('Canada', 'Canada')], validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=8, message='Password must be at least 8 characters long.'),
            UppercaseValidator,
            LowercaseValidator,
            DigitalValidator,
            SpecialCharacterValidator])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password', message='Passwords must match')])
    submit = SubmitField('Sign Up')
    
    def validate_username(self, username):
        traveler = UserTraveler.query.filter_by(username = username.data).first()
        if traveler:
            raise ValidationError('That username is taken. Please Choose a different one.')
        
    def validate_email_address(self, email_address):
        traveler = UserTraveler.query.filter_by(email = email_address.data).first()
        if traveler:
            raise ValidationError('That Email is taken. Please Choose a different one.')

class TravelerLoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')
    
    
    
    
    
    
    
    
#  REGISTRAION AND LOGIN FORM FOR TOURGUIDE
class TourGuideRegistrationForm(FlaskForm):
    email_address = StringField('Email Address', validators=[DataRequired(), Length(min=6, max=254)])
    #confirm_email = StringField('Confirm Email', validators=[DataRequired(), Email(), EqualTo('email_address', message='Emails must match')])
    username = StringField('Username', validators=[DataRequired()])
    sex = SelectField('Sex', choices=[ ('male', 'Male'), ('female', 'Female')], validators=[DataRequired()])
    nationality = SelectField('Nationality', choices=[        ('Philippines', 'Philippines'),
        ('United States', 'United States'),
        ('Japan', 'Japan'),
        ('Canada', 'Canada'),], validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password', message='Passwords must match')])
    submit = SubmitField('Sign Up')
    
    def validate_username(self, username):
        tourguide = UserTourGuide.query.filter_by(username = username.data).first()
        if tourguide:
            raise ValidationError('That username is taken. Please Choose a different one.')
        
    def validate_email_address(self, email_address):
        tourguide = UserTourGuide.query.filter_by(email = email_address.data).first()
        if tourguide:
            raise ValidationError('That Email is taken. Please Choose a different one.')

class TourGuideLoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')
    
    
    
    
    
    
    
   #TRAVELER RESET PASSWORD FORM 
class TravelerRequestResetForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    submit = SubmitField('Request Password Reset')
    
    def validate_email(self, email):
        traveler = UserTraveler.query.filter_by(email = email.data).first()
        if traveler is None:
            raise ValidationError('There is no account with email. You must register first.')
        
class TravelerResetPasswordForm(FlaskForm):
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password', message='Passwords must match')])
    submit = SubmitField('Reset Password')
    
    
# TOURGUIDE RESET PASSWORD
class TourGuideRequestResetForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    submit = SubmitField('Request Password Reset')
    
    def validate_email(self, email):
        tourguide = UserTourGuide.query.filter_by(email = email.data).first()
        if tourguide is None:
            raise ValidationError('There is no account with email. You must register first.')
        
class TourGuideResetPasswordForm(FlaskForm):
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password', message='Passwords must match')])
    submit = SubmitField('Reset Password')
