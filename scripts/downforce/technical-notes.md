# The Science of Downforce — Technical Notes

## Scope

Original procedural GT-inspired 3D vehicle, not a manufacturer model. No external vehicle model or logo is used. Body and cabin are custom curved meshes; wings use an extruded airfoil-like section, with splitter, floor, diffuser strakes, wheel assemblies and contact-patch markers. This is a designed educational vehicle, not a homologated or CFD-validated race car.

## Aerodynamics

Downforce is the downward component of aerodynamic force, arising from pressure and viscous shear integrated over surfaces. The wing's illustrative upper amber/lower blue regions indicate relatively higher/lower pressure in the depicted inverted-wing example. They are qualitative, have no numeric scale, and are not claimed as measured pressure coefficients. Force arrows point downward in world space.

Underfloor visualization follows a road-to-floor passage and rear expansion. The diffuser is not described as a vacuum cleaner; flow/pressure depends on the entire underfloor, ride height and operating conditions. Streamlines are prescribed geometric teaching paths, labeled **ILLUSTRATIVE AIRFLOW**. They are not CFD trajectories, smoke measurements or physical wires. Path-envelope tests guard against gross body penetration, not validate Navier–Stokes flow.

Vertical aerodynamic load can increase available tire force but tire load sensitivity prevents a perfectly proportional grip increase. Small tire deformation is stylized. The ending explicitly notes drag trade-offs; downforce does not guarantee improved performance in every circumstance. Under comparable conditions, force scaling approximately follows airspeed squared; coefficients can change with attitude/ride height/stall. No invented speed/downforce/pressure numbers are presented.

## Sources

- NASA Glenn, Lift Equation: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-equation/
- NASA Glenn, Aerodynamic Forces: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/aerodynamic-forces/

Reference pages were fetched during production. The equation's square-speed relation applies under comparable density/reference area/coefficient, not universally constant coefficients on an arbitrary race car.

## Production limits

Three.js real-time rendering inside Remotion ThreeCanvas, not offline ray-traced automotive photography. No CFD dataset. Original engine sound is synthesis, not a field recording or a specific manufacturer's engine. Optional English voiceover is not included; the narration script and SRT are delivered for later recording. Core education is in on-screen typography. All visible text is English. No persistent top/bottom decorative chrome is used.
