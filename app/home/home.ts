import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {
  @ViewChild('star1') star1!: ElementRef;
  @ViewChild('star2') star2!: ElementRef;
  @ViewChild('star3') star3!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    // Start Star 1
    this.randomizeAndAnimate(this.star1.nativeElement);

    // Stagger Star 2 and 3 for a more active background
    setTimeout(() => this.randomizeAndAnimate(this.star2.nativeElement), 1500);
    setTimeout(() => this.randomizeAndAnimate(this.star3.nativeElement), 3000);

    // Listen for animation finish to move them again
    [this.star1, this.star2, this.star3].forEach(star => {
      this.renderer.listen(star.nativeElement, 'animationend', () => {
        this.randomizeAndAnimate(star.nativeElement);
      });
    });
  }

  randomizeAndAnimate(starElement: HTMLElement) {
    this.renderer.removeClass(starElement, 'star-active');

    const randomX = Math.floor(Math.random() * 80) + 10;
    const randomY = Math.floor(Math.random() * 70) + 10;

    this.renderer.setStyle(starElement, 'left', `${randomX}%`);
    this.renderer.setStyle(starElement, 'top', `${randomY}%`);

    void starElement.offsetWidth; 
    this.renderer.addClass(starElement, 'star-active');
  }

  onMouseMove(e: MouseEvent) {
    const bg = e.currentTarget as HTMLElement;
    const rect = bg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    bg.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    bg.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  }
}