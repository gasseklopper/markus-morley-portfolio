export const homeHeroImages = [
  "../assets/images/photography/black/Black_001-min.jpg",
  "../assets/images/photography/black/Template_index_01.jpg",
  "../assets/images/photography/black/Template_index_02.jpg",
  "../assets/images/photography/black/Template_index_03.jpg",
  "../assets/images/photography/black/Template_index_04.jpg",
  "../assets/images/photography/black/Template_index_05.jpg",
  "../assets/images/photography/black/Template_index_06.jpg",
  "../assets/images/photography/black/Template_index_07.jpg",
  "../assets/images/photography/black/Template_index_08.jpg",
  "../assets/images/photography/black/Template_index_09.jpg",
  "../assets/images/photography/black/Template_index_010.jpg",
  "../assets/images/photography/black/Template_index_011.jpg",
  "../assets/images/photography/black/Template_index_012.jpg",
  "../assets/images/photography/black/Template_index_013.jpg",
  "../assets/images/photography/black/Template_index_014.jpg",
  "../assets/images/photography/black/Template_index_015.jpg",
  "../assets/images/photography/black/Template_index_016.jpg",
  "../assets/images/photography/black/Template_index_017.jpg",
  "../assets/images/photography/black/Template_index_018.jpg",
  "../assets/images/photography/black/Template_index_019.jpg",
  "../assets/images/photography/black/Template_index_020.jpg",
];

export const createHomeHeroConfig = () => {
  const isMobile =
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
    window.innerWidth <= 768;

  return {
    imageCount: 14,
    imageLifespan: 600,
    removalDelay: 16,
    mouseThreshold: isMobile ? 20 : 40,
    scrollThreshold: 50,
    inDuration: 600,
    outDuration: 800,
    inEasing: "cubic-bezier(.07,.5,.5,1)",
    outEasing: "cubic-bezier(.87, 0, .13, 1)",
    touchImageInterval: 40,
    minMovementForImage: isMobile ? 3 : 5,
    baseImageSize: isMobile ? 180 : 240,
    minImageSize: isMobile ? 120 : 160,
    maxImageSize: isMobile ? 260 : 340,
    baseRotation: 30,
    maxRotationFactor: 3,
    speedSmoothingFactor: 0.25,
    showSpeedIndicator: true,
    staggerRange: 50,
    easing: {
      scale: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      reveal: "cubic-bezier(0.87, 0, 0.13, 1)",
    },
  } as const;
};

export type HomeHeroConfig = ReturnType<typeof createHomeHeroConfig>;
