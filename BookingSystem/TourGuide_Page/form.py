from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, FieldList, TextAreaField
from wtforms.validators import DataRequired, Email, Length, EqualTo, ValidationError
from BookingSystem.models import User  # Adjust the import according to your project structure


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

class UserTourGuideForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email(), Length(min=6, max=300)])
    contact_number = StringField('Contact Number', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=8, message='Password must be at least 8 characters long.'),
        UppercaseValidator,
        LowercaseValidator,
        DigitalValidator,
        SpecialCharacterValidator])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password', message="Passwords must match.")])
    submit = SubmitField('Create Account')
    
    def validate_email(self, email):
        # Check if the email is already used by a traveler
        tourguide = User.query.filter_by(email=email.data).first()
        if tourguide:
            raise ValidationError('That email is already in use. Please choose a different one.')

class PasswordConfirmationForm(FlaskForm):
    password = PasswordField('Password', validators=[DataRequired()])
    
    
    
    class AboutMeForm(FlaskForm):
        bio = TextAreaField('About Me', validators=[DataRequired(), Length(max=500)])
        submit = SubmitField('Save')
        
    class CharacteristicsForm(FlaskForm):
        characteristics = FieldList(StringField('Characteristic', validators=[DataRequired()]), min_entries=1)
        submit = SubmitField('Save Characteristics')
        
    class SkillsForm(FlaskForm):
        skills = FieldList(StringField('Skill', validators=[DataRequired()]), min_entries=1)
        submit = SubmitField('Save Skills')