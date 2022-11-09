# interactive-us-map

Playing with SVG animations to make interactive, accessible map of the US to display locations

## Demo

https://corporate-locations.netlify.app/#

## Problems:

1. [DONE] position of zoomed-in states
   (This was done 3 different ways: 1) using transform and scale but that made zoomed-in portion overflow the container; 2) using SMIL, but support is questionable and it didn't always work; 3) finally manipulating viewBox w/ JS)
2. [DONE] transition b/w zoomed-in states
   (This was done w/ updating viewBox values very fast w/ JS using requestAnimationFrame)
3. [DONE] pins cutoff
   (Replace pins w/ circles from SimpelMaps and reduce radius)
4. [DONE] states need to be clickable w/ keyboard
5. [DONE] when zoomed-in, keyboard tabbing still goes through all interactive elems. it should be limited to zoomed in pins only
   (Jens has similar code but I didn't end up using his code)
6. [DONE] tooltips on pins when zoomed-in

7. what happens with small states? when clicked, zoom in on text + state, display city
8. accessibility markup add
9. probably the hardest part: how to plot locations on map using lat/long coordinates
