from flask import render_template, redirect, url_for, flash, request, session
from flask_login import login_required, current_user, logout_user
from . import touroperator  
from werkzeug.security import generate_password_hash, check_password_hash
from BookingSystem import bcrypt, db 
from BookingSystem.TourOperator_Page.form import UserTourGuideForm
from BookingSystem.models import  UserTourGuide  

@touroperator.route('/create_tourguide', methods=['GET', 'POST'])
@login_required
def create_tourguide():
    form = UserTourGuideForm()  # Instantiate the form
    if form.validate_on_submit():
        # Hash the password
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        
        # Create a new tour guide instance
        new_tourguide = UserTourGuide(
            fname=form.fname.data,
            lname=form.lname.data,
            email=form.email.data,
            contact_number=form.contact_number.data,
            password=hashed_password,
            role='tourguide',  # Ensure your model supports this role
            confirmed=True,
            active=True  # Set to True if you want to activate the account upon creation
        )

        try:
            # Save to the database
            db.session.add(new_tourguide)
            db.session.commit()
            flash('Tour Guide account created successfully!', 'success')
            return redirect(url_for('touroperator.touroperator_dashboard'))  # Redirect to the tour guide dashboard

        except Exception as e:
            # Handle errors gracefully
            db.session.rollback()
            flash('An error occurred while creating the account. Please try again.', 'danger')
            print(f"Database error: {e}")  # Debugging information

    return render_template('touroperator_dashboard.html', form=form)  # Render the create tour guide template


@touroperator.route('/dashboard')
@login_required
def touroperator_dashboard():
    # Ensure only tour operators can access this page
    if current_user.role != 'touroperator':
        flash('You do not have permission to access this page.', 'danger')
        return redirect(url_for('main.home'))
    
    form = UserTourGuideForm()  # Instantiate the form for the dashboard
    return render_template('touroperator_dashboard.html', title='TourOperator Dashboard', form=form)







@touroperator.route('/logout')
@login_required
def logout():
    logout_user()
    session.clear()
    flash('Logged out successfully.', 'success')
    return redirect(url_for('main.home'))





@touroperator.route('/tourguide_dashboard/<int:id>', methods=['GET'])
@login_required
def tourguide_profile(id):
    print(f"Received Tour Guide ID: {id}")  # Debug

    tourguide = UserTourGuide.query.get_or_404(id)
    print(f"Tour Guide: {tourguide.email}, ID: {tourguide.id}")  # Debug

    return render_template('tourguide_dashboard.html', tourguide=tourguide)



