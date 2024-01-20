import {
  HydrusNumericalRatingService,
  HydrusLikeRatingService,
  HydrusIncDecRatingService,
} from "../ratings/hydrus-rating";
import {
  HydrusServiceSimple,
  HydrusServiceType,
} from "../ratings/hydrus-services";
import { SystemPredicate } from "../ratings/hydrus-system-predicates";

export function isNumericalRatingService(
  service: HydrusServiceSimple | HydrusNumericalRatingService
): service is HydrusNumericalRatingService {
  return (
    service.type === HydrusServiceType.LOCAL_RATING_NUMERICAL ||
    service.type === HydrusServiceType.RATING_NUMERICAL_REPOSITORY
  );
}

export function isLikeRatingService(
  service: HydrusServiceSimple | HydrusLikeRatingService
): service is HydrusLikeRatingService {
  return (
    service.type === HydrusServiceType.LOCAL_RATING_LIKE ||
    service.type === HydrusServiceType.RATING_LIKE_REPOSITORY
  );
}

export function isIncDecRatingService(
  service: HydrusServiceSimple
): service is HydrusIncDecRatingService {
  return service.type === HydrusServiceType.LOCAL_RATING_INCDEC;
}

export function ratingsServiceToRatingPredicate(service: HydrusServiceSimple) {
  if (isNumericalRatingService(service)) {
    return SystemPredicate.RATING_SPECIFIC_NUMERICAL;
  } else if (isLikeRatingService(service)) {
    return SystemPredicate.RATING_SPECIFIC_LIKE_DISLIKE;
  } else if (isIncDecRatingService(service)) {
    return SystemPredicate.RATING_SPECIFIC_INCDEC;
  }
  return null;
}

export function isRatingService(service: HydrusServiceSimple) {
  return (
    isIncDecRatingService(service) ||
    isLikeRatingService(service) ||
    isNumericalRatingService(service)
  );
}
