import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../Services/LocalStorage.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements OnInit {
  currentYear = new Date().getFullYear();
  logoFooter: string | null = null;

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.logoFooter = this.localStorageService.getItem('LogoFooter');
  }

}
