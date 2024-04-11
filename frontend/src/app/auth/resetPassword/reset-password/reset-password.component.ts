import {Component, OnInit,Renderer2} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from 'src/app/Service/UserService/user-service.service';
import {ScriptStyleLoaderService} from 'src/app/Service/script-style-loader/script-style-loader.service';
import { ScriptService } from 'src/app/Service/script/script.service';
import {MustMatch} from 'src/app/validator/must-match.validator';
import Swal from 'sweetalert2';
const SCRIPT_PATH_LIST =[
    "assets/auth/js/bootstrap.min.js",
    "assets/auth/js/imagesloaded.pkgd.min.js",
    "assets/auth/js/validator.min.js",
    "assets/auth/js/main.js"
  ]
@Component({selector: 'app-reset-password', templateUrl: './reset-password.component.html', styleUrls: ['./reset-password.component.scss']})
export class ResetPasswordComponent implements OnInit {
    submitted = true; // Change to true to display validation messages on load
    token !: string;
    form !: FormGroup;
    constructor(private ScriptServiceService: ScriptService ,private renderer: Renderer2 ,private scriptStyleLoaderService : ScriptStyleLoaderService, public service : UserService, public fb : FormBuilder, private router : Router, private route : ActivatedRoute) {}
    ngOnInit(): void {

 
        this.infoForm();
        this.route.queryParams.subscribe(params => {
            this.token = params['token'];
        });

        this.f['token'].setValue(this.token);
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
