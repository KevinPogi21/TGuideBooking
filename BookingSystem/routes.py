import os
from flask import Blueprint, render_template, url_for, flash, redirect
from BookingSystem import db, bcrypt, mail
from BookingSystem.forms import TravelerLoginForm, TravelerRegistrationForm, TourGuideLoginForm, TourGuideRegistrationForm, TravelerRequestResetForm, TravelerResetPasswordForm, TourGuideRequestResetForm, TourGuideResetPasswordForm
from BookingSystem.models import UserTraveler, UserTourGuide, send_confirmation_traveler_email, send_confirmation_tourguide_email
from flask_login import login_user, current_user, logout_user
#from flask_mail import Message

from flask_dance.contrib.google import make_google_blueprint, google
from flask_dance.contrib.facebook import make_facebook_blueprint, facebook



main = Blueprint('main', __name__)  # Ensure the 'main' blueprint is set


facebook_bp = make_facebook_blueprint(client_id='your-facebook-client-id',
                                      client_secret='your-facebook-client-secret',
                                      redirect_to='main.home')

google_bp = make_google_blueprint(client_id='your-client-id', client_secret='your-client-secret', redirect_to='main.home')
main.register_blueprint(google_bp, url_prefix='/google_login')
main.register_blueprint(facebook_bp, url_prefix='/facebook_login')


@main.route('/google_login')
def google_login():
    if not google.authorized:
        return redirect(url_for('main.google_login'))
    resp = google.get("/plus/v1/people/me")
    assert resp.ok, resp.text
    # Process Google login data here
    
    
@main.route('/facebook_login')
def facebook_login():
    if not facebook.authorized:
        return redirect(url_for('main.facebook.login'))
    resp = facebook.get("/me?fields=id,name,email")
    assert resp.ok, resp.text
    # Process Facebook login data here
    return render_template('home.html')




@main.route('/')
@main.route('/home')
def home():
    return render_template('home.html')

@main.route('/register')
def register():
    return render_template('register.html')

# TRAVELER LOGIN
@main.route('/traveler_login', methods=['GET', 'POST'])
def traveler_login():
    if current_user. is_authenticated:
        return redirect(url_for('main.home'))
    form = TravelerLoginForm()
    if form.validate_on_submit():
        traveler = UserTraveler.query.filter_by(email=form.email.data).first()
        if traveler and bcrypt.check_password_hash(traveler.password, form.password.data):
            if traveler.confirmed:
                login_user(traveler)
                return redirect(url_for('main.home'))
            else:
                flash('Your account is not confirmed yet. Please check your email.', 'warning')
                return redirect(url_for('main.pending_confirmation'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('traveler_login.html', title='TravelerLogin', form=form)

# TRAVELER REGISTER 
@main.route('/traveler_register', methods=['GET', 'POST'])
def traveler_register():
    if current_user. is_authenticated:
        return redirect(url_for('main.home'))
    form = TravelerRegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        new_traveler = UserTraveler(
            email=form.email_address.data,
            username=form.username.data,
            sex=form.sex.data,
            nationality=form.nationality.data, 
            password=hashed_password,
            image_file='default.jpg'
        )
        db.session.add(new_traveler)
        db.session.commit()
        send_confirmation_traveler_email(new_traveler)
        #flash(f'Account created for Traveler {form.username.data}!', 'success')
        flash('Registration successful! Please confirm your email to complete the process.', 'info')
        return redirect(url_for('main.pending_confirmation'))
    else:
        print(form.errors)
    return render_template('traveler_register.html', title='TravelerRegister', form=form)

@main.route('/pending_confirmation')
def pending_confirmation():
    return render_template('pending_confirmation.html') 

# TOURGUIDE LOGIN 
@main.route('/tourguidelogin', methods=['GET', 'POST'])
def tourguide_login():
    form = TourGuideLoginForm()
    if form.validate_on_submit():
        tourguide = UserTourGuide.query.filter_by(email=form.email.data).first()
        if tourguide and bcrypt.check_password_hash(tourguide.password, form.password.data):
            if tourguide.confirmed:
                login_user(tourguide)
                return redirect(url_for('main.tourguide_dashboard'))
            else:
                flash('Your account is not confirmed yet. Please check your email.', 'warning')
                return redirect(url_for('main.pending_confirmation'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('tourguidelogin.html', title='TourGuideLogin', form=form)

# TOURGUIDE REGISTER 
@main.route('/tourguideregister', methods=['GET', 'POST'])
def tourguide_register():
    form = TourGuideRegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        new_tour_guide = UserTourGuide(
            email=form.email_address.data,
            username=form.username.data,
            sex=form.sex.data,
            nationality=form.nationality.data, 
            password=hashed_password,
            image_file='default.jpg'
        )
        db.session.add(new_tour_guide)
        db.session.commit()
        send_confirmation_tourguide_email(new_tour_guide)
        flash('Registration successful! Please confirm your email to complete the process.', 'info')
        return redirect(url_for('main.pending_confirmation'))
    else:
        print(form.errors)
    return render_template('tourguideregister.html', title='TourGuideRegister', form=form)

@main.route('/tourguide_dashboard')
def tourguide_dashboard():
    
    flash('Welcome to your dashboard!', 'success')
    return render_template('tourguide_dashboard.html')


#CONFIRMATION EMAIL FOR TRAVELER
@main.route('/confirm_email/<token>')
def confirm_email(token):
    user = UserTraveler.verify_confirmation_token(token)
    if not user:
        user = UserTourGuide.verify_confirmation_token(token)
    if user is None:
        flash('The confirmation link is invalid or has expired.', 'warning')
        return redirect(url_for('main.home'))
    user.confirmed = True
    db.session.commit()
    flash('Your email has been confirmed! You can now log in.', 'success')
    if isinstance(user, UserTraveler):
        return redirect(url_for('main.traveler_login'))
    else:
        return redirect(url_for('main.tourguide_login'))
    
#CONFIRMATION EMAIL FOR TOURGUIDE
@main.route('/confirm_tourguide_email/<token>')
def confirm_tourguide_email(token):
    user = UserTourGuide.verify_confirmation_token(token)
    if not user:
        user = UserTourGuide.verify_confirmation_token(token)
    if user is None:
        flash('The confirmation link is invalid or has expired.', 'warning')
        return redirect(url_for('main.home'))
    user.confirmed = True
    db.session.commit()
    flash('Your email has been confirmed! You can now log in.', 'success')
    if isinstance(user, UserTourGuide):
        return redirect(url_for('main.tourguide_login'))
    else:
        return redirect(url_for('main.traveler_login')) 
    


# RESET PASSWORD FOR TRAVELER
@main.route('/traveler_reset_password', methods=['GET', 'POST'])
def traveler_reset_request():
    form = TravelerRequestResetForm()
    
    if form.validate_on_submit():
        traveler = UserTraveler.query.filter_by(email=form.email.data).first()
        if traveler:
            traveler.send_reset_email()
            flash('An email has been sent with instructions to reset your password.', 'info')
            return redirect(url_for('main.traveler_login'))
        else:
            flash('There is no account with that email. Please register first.', 'warning')
            return redirect(url_for('main.traveler_register'))
    
    return render_template('traveler_reset_request.html', title='Reset Password', form=form)



@main.route('/traveler_reset_password/<token>', methods=['GET', 'POST'])
def traveler_reset_token(token):
    traveler = UserTraveler.verify_reset_token(token)  # Verify the token first
    if traveler is None:
        flash('That is an invalid or expired token', 'warning')
        return redirect(url_for('main.traveler_reset_request')) 

    form = TravelerResetPasswordForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        traveler.password = hashed_password
        db.session.commit()
        flash('Your password has been updated! You are able to log in now.', 'success')
        return redirect(url_for('main.traveler_login'))
    return render_template('traveler_reset_token.html', title='Reset Password', form=form)



# RESET PASSWORD FOR TOURGUIDE

@main.route('/tourguide_reset_password', methods=['GET', 'POST'])
def tourguide_reset_request():
    form = TourGuideRequestResetForm()
    
    if form.validate_on_submit():
        tourguide = UserTourGuide.query.filter_by(email=form.email.data).first()
        if tourguide:
            tourguide.send_reset_email()
            flash('An email has been sent with instructions to reset your password.', 'info')
            return redirect(url_for('main.tourguide_login'))
        else:
            flash('There is no account with that email. Please register first.', 'warning')
            return redirect(url_for('main.tourguideregister'))
    
    return render_template('tourguide_reset_request.html', title='Reset Password', form=form)



@main.route('/tourguide_reset_password/<token>', methods=['GET', 'POST'])
def tourguide_reset_token(token):
    tourguide = UserTourGuide.verify_reset_token(token)  # Verify the token first
    if tourguide is None:
        flash('That is an invalid or expired token', 'warning')
        return redirect(url_for('main.tourguide_reset_request')) 

    form = TourGuideResetPasswordForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        tourguide.password = hashed_password
        db.session.commit()
        flash('Your password has been updated! You are able to log in now.', 'success')
        return redirect(url_for('main.tourguide_login'))
    return render_template('tourguide_reset_token.html', title='Reset Password', form=form)


@main.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('main.home')) 



    
    
    
    
    
    



