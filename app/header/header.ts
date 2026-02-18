import { Component, AfterViewInit, OnDestroy, NgZone, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from "@angular/router";
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements AfterViewInit, OnDestroy {
  @ViewChild('navContainer') navContainer!: ElementRef; // Reference to your .nav-links-container

  sliderWidth = 0;
  sliderLeft = 0;
  isShining = false;
  private observer: MutationObserver | null = null; // Watches for class changes

  constructor(private router: Router, private zone: NgZone) {
    // Listen for route changes as a backup trigger
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.syncPill();
    });
  }

  ngAfterViewInit() {
    // 1. Initial sync
    this.syncPill();

    // 2. The Secret Sauce: Watch for the '.active' class moving
    this.observer = new MutationObserver(() => {
      this.zone.run(() => this.resetSlider());
    });

    if (this.navContainer) {
      this.observer.observe(this.navContainer.nativeElement, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class'] // Only trigger when a class changes
      });
    }
  }

  ngOnDestroy() {
    if (this.observer) this.observer.disconnect(); // Cleanup
  }

  updateSlider(element: HTMLElement) {
    if (!element) return;
    this.sliderWidth = element.offsetWidth;
    this.sliderLeft = element.offsetLeft;
  }

  resetSlider() {
    // Search only within the header's nav container
    const activeElement = this.navContainer.nativeElement.querySelector('a.active') as HTMLElement;
    if (activeElement) {
      this.updateSlider(activeElement);
    }
  }

  private syncPill() {
    setTimeout(() => {
      this.resetSlider();
      this.triggerShine();
    }, 100); // Small buffer for Angular's router logic
  }

  triggerShine() {
    this.isShining = true;
    setTimeout(() => this.isShining = false, 600);
  }
}