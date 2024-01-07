# Project Overview
Membership and authentication are the bedrock of user engagement and security in any application. These essential components empower users to register, log in, verify their email, recover forgotten passwords, and reset their passwords, ensuring a seamless and secure user experience. this membership not only enhances user accessibility but also fortifies the application against unauthorized access and potential security vulnerabilities.

## App features
1. Signup: Users can register a new account by providing their name, email, password, and confirming the password.

2. Email Verification: After users sign up, a confirmation email is sent to their email account to verify their email address.

3. Login: Once the email is successfully verified, users can log in to the application using their credentials.

4. Logout: Users can log out from the application, ending their current session.

5. Forgot Password: Users can reset their password by providing their email address. A link to reset the password will be sent to their email.

6. Reset Password: After receiving the password reset link in their email, users can set a new password for their account.
# Technologies used 
- Node js & Express Js
- MongoDB & Mongoose
- Javascript
- JavaScript library: helmet, ...
- Nodemailer
- cores library
# Installation
## Clone to local Machine
> git clone https://github.com/anb-hq/Bunthai_Membership_TechTitan_Back-End.git <br>
> npm install 
> npm start <br>

# My Git flow Strategy
1. ## Main Branch: 
- I create the main branch for the GitHub repository.
2. ## Development Branch: 
- I branch out from the main branch to create a development branch in order to keep the main branch stable and to work on new features.

3. ## Feature Branches: 
- I create feature branches from the development branch to work on specific features for the application. Once a feature is complete, merge the feature branch back into the development branch.

4. ## Release Branch: 
- After all the features are completed and tested, I create a release branch from the development branch. Test the release branch for any bugs, and if everything is working correctly, merge it into both the main branch and the development branch.

5. ## Bugfix Branch: 
- If any bugs are discovered after the release, create a bugfix branch from the release branch to fix the issues. Once fixed, merge the bugfix branch back into the release branch. But In my project, I didn't use bugfix because there is no bug after release

6. ## Hotfix Branch: 
- In case of critical bugs that need to be fixed immediately after deployment, create a hotfix branch from the main branch, fix the bugs, and then merge the hotfix branch back into both the main branch and the development branch.
