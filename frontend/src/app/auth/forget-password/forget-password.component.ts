import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import { ScriptStyleLoaderService } from 'src/app/Service/script-style-loader/script-style-loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  submitted = false;

  constructor(
    public service: UserService,
    private fb: FormBuilder,
    private scriptStyleLoaderService: ScriptStyleLoaderService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    const SCRIPT_PATH_LIST = [
      "../../../assets/auth/js/jquery-3.5.0.min.js",
      "../../../assets/auth/js/bootstrap.min.js",
      "../../../assets/auth/js/imagesloaded.pkgd.min.js",
      "../../../assets/auth/js/validator.min.js",
      "assets/auth/js/main.js"
    ];
    const STYLE_PATH_LIST = [
      'assets/auth/css/bootstrap.min.css',
      'assets/auth/font/flaticon.css',
      'assets/auth/style.css'
    ];

    this.loadScriptsAndStyles(SCRIPT_PATH_LIST, STYLE_PATH_LIST);
  }

  initForm() {
    this.form = this.fb.group({
      email: [
        '',
        [
          Validators.required, Validators.email, Validators.minLength(8)
        ]
      ]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.service.forgetPassword(this.form.value.email).subscribe((response: any) => {
      Swal.fire({ icon: 'success', title: 'Success!', text: response.message });
      this.form.get('email')?.reset();
      this.submitted = false;
    }, (error) => {
      Swal.fire({ icon: 'error', title: 'Error!', text: error.error.message });
    });
  }

  private loadScriptsAndStyles(scriptPaths: string[], stylePaths: string[]): void {
    Promise.all([
      this.scriptStyleLoaderService.loadScripts(scriptPaths),
      this.scriptStyleLoaderService.loadStyles(stylePaths)
    ]).then(() => {
      // All scripts and styles have finished loading
      // Call addNewClass function to add 'loaded' class
    }).catch(error => {
      console.error('Error loading scripts or styles:', error);
    });
  }
}
