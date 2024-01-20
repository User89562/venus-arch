import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { HydrusNumericalRating, HydrusNumericalRatingValue, ratingIcons, ratingIconsOutline } from '../hydrus-rating';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CUBE, GRAPH, ratingsIcons } from '../svg-icons';
import { CommonModule } from '@angular/common';
import { MaterialComponments } from '../../modules/material-components.module';

@Component({
  selector: 'app-rating-numerical',
  templateUrl: './rating-numerical.component.html',
  styleUrls: ['./rating-numerical.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MaterialComponments
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingNumericalComponent {

  @Input() rating!: HydrusNumericalRating;

  @Output() ratingSet = new EventEmitter<HydrusNumericalRatingValue>();

  ratingIcons = ratingIcons;
  ratingIconsOutline = ratingIconsOutline;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    iconRegistry.addSvgIconLiteral('cube', sanitizer.bypassSecurityTrustHtml(CUBE));
    iconRegistry.addSvgIconLiteral('graph', sanitizer.bypassSecurityTrustHtml(GRAPH));
    Object.entries(ratingsIcons).forEach(([name, literal]) => iconRegistry.addSvgIconLiteralInNamespace('rating', name, sanitizer.bypassSecurityTrustHtml(literal)))
  }

  setRating(value: HydrusNumericalRatingValue) {
    this.ratingSet.emit(value);
  }

}
