import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from 'src/app/Service/UserService/user-service.service';
import {ScriptStyleLoaderService} from 'src/app/Service/script-style-loader/script-style-loader.service';
import {MustMatch} from 'src/app/validator/must-match.validator';
import Swal from 'sweetalert2';

@Component({selector: 'app-reset-password', templateUrl: './reset-password.component.html', styleUrls: ['./reset-password.component.scss']})
export class ResetPasswordComponent implements OnInit {
    submitted = true; // Change to true to display validation messages on load
    token !: string;
    form !: FormGroup;
    constructor(private scriptStyleLoaderService : ScriptStyleLoaderService, public service : UserService, public fb : FormBuilder, private router : Router, private route : ActivatedRoute) {}
    ngOnInit(): void {
        const SCRIPT_PATH_LIST = [
            "../../../assets/auth/js/jquery-3.5.0.min.js",
            "../../../assets/auth/js/bootstrap.min.js",
            "../../../assets/auth/js/imagesloaded.pkgd.min.js",
            "../../../assets/auth/js/validator.min.js",
            "assets/auth/js/main.js"
        ];
        const STYLE_PATH_LIST = ['assets/auth/css/bootstrap.min.css', 'assets/auth/font/flaticon.css', 'assets/auth/style.css'];

        Promise.all([this.scriptStyleLoaderService.loadScripts(SCRIPT_PATH_LIST), this.scriptStyleLoaderService.loadStyles(STYLE_PATH_LIST)]).then(() => {
            // All scripts and styles have finished loading
            // Call addNewClass function to add 'loaded' class
            this.addNewClass();
        }).catch(error => {
            console.error('Error loading scripts or styles:', error);
        });
        this.infoForm();
        this.route.queryParams.subscribe(params => {
            this.token = params['token'];
        });

        this.f['token'].setValue(this.token);
    }
    addNewClass(): void {
        $('.fxt-template-animation').imagesLoaded().done(function () {
            $('.fxt-template-animation').addClass('loaded');
        });
    }
    get f(): {
    [key: string]: AbstractControl
    } {
        return this.form.controls;
    }
    infoForm() {
        this.form = this.fb.group({
            password: [
                '',
                [
                    Validators.required, Validators.minLength(8)
                ]
            ],
            pwd: [
                '',
                [Validators.required]
            ],
            token: ['']
        }, {
            validator: MustMatch('password', 'pwd')
        });
    }
    onSubmit() {
        this.submitted = true;
        this.service.resetPassword(this.token, this.form.value.password).subscribe((response : any) => {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.message,
                timer: 2000, // Adjust the duration as needed
            });
            // Navigate to login after the timer expires
            setTimeout(() => {
                this.router.navigate(['/auth/login']);
            }, 2000); // Match the timer duration
        }, (error) => {
            Swal.fire({icon: 'error', title: 'Error!', text: error.error.message});
        });
    }


}
