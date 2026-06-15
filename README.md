# Michelson Interferometer Weak Force Measurement Simulation

[简体中文](./README.zh-CN.md) | English

![](https://raw.githubusercontent.com/Ferdinandhu000/my_blog_img/master/20260615125627.png)

This is a physical virtual simulation project developed based on React, Vite, TypeScript, Tailwind CSS v4, and Motion. The project aims to simulate and display the physical experimental process of precision measurement of weak external force using a Michelson interferometer.

## Physics Background and Core Principles

In classical mechanics and precision measurement, weak forces (such as micro-Newton $\mu\text{N}$ scale) are usually difficult to measure directly with ordinary mechanical balances. This project converts the weak force into a micro displacement, and then uses the interference fringe shift of a Michelson interferometer to precisely measure the displacement, thereby indirectly obtaining the magnitude of the weak force.

### 1. Hooke's Law
When a weak force $F$ acts on an elastic element (such as a micro spring or cantilever beam) with a stiffness coefficient of $k$, it produces a micro deformation displacement $\Delta x$:
$$F = k \cdot \Delta x$$
In this project, the spring stiffness coefficient is set as:
$$k = 0.485 \, \text{N/m}$$

### 2. Michelson Interferometry Principle
The laser emitted by a Helium-Neon (He-Ne) laser (wavelength $\lambda = 632.8 \, \text{nm}$) is split into two beams by a beam splitter (BS):
- **Beam A**: Reflected by the fixed mirror $M_1$ and returns.
- **Beam B**: Reflected by the movable mirror $M_2$ and returns.

The two beams merge at the beam splitter and generate interference on the observation screen. When the movable mirror $M_2$ produces a displacement $\Delta x$, the optical path of beam B changes by $2\Delta x$, causing the interference fringes to move.

The number of moving interference fringes (fringe shift cycle) $N$ and the mirror displacement $\Delta x$ satisfy the following relationship:
$$N = \frac{2\Delta x}{\lambda}$$
By high-precision real-time calculation of $N$, we can deduce the extremely small displacement $\Delta x$, and use Hooke's Law to calculate the weak force $F$ acting on $M_2$.

---

## Key Features

- **Dynamic Schematic Diagram**: Real-time rendering of the Michelson interferometer structure using SVG, including the laser source, beam splitter (BS), fixed mirror $M_1$, movable mirror $M_2$, observation screen, and a micro spring that stretches/compresses in real-time with the applied force.
- **Photon Animation Simulation**: Displays two sets of photons in different colors (blue and green) moving back and forth along the optical paths, visually demonstrating the interference merging process of the two coherent beams.
- **Real-time Fringe Drawing**: Uses HTML5 Canvas to calculate the phase difference in real-time based on the current displacement, drawing concentric red He-Ne interference fringes, and presenting a dynamic "fringe shift" effect as the weak force is applied and released.
- **Precision Metrics Dashboard**:
  - Displacement $\Delta x$
  - Optical Path Difference $\text{OPD}$
  - Fringe shift count $N$
  - Measured weak force magnitude $F$
- **Modern User Interface**: Minimalist and premium look, supporting smooth animations for applying and releasing the weak force.

---

## Tech Stack

- **Frontend Framework**: React 19, TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4 (Modern CSS-only imports)
- **Animation**: Motion React (formerly Framer Motion), Lucide Icons (Icons)

---

## Local Development and Running Guide

### 1. Clone / Download the Project
Pull the project files into your local directory.

### 2. Install Dependencies
Run the following command in the project root directory to install the required Node packages:
```bash
npm install
```

### 3. Start the Development Server
Start the Vite local development server:
```bash
npm run dev
```
Once started, open the local URL prompted in the command line in your browser to experience the simulation.
