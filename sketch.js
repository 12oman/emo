let blob;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Smooth animation
  frameRate(30);
  
  // Create initial blob
  blob = createBlob();
}

function draw() {
  // Black background
  background(0);
  
  // Lighting setup for dramatic metallic effect
  ambientLight(20);
  directionalLight(200, 200, 220, 0.5, 0.5, -1);
  pointLight(180, 190, 220, 200, 200, 200);
  
  // Rotate and move the entire scene
  rotateX(sin(time * 0.4) * 0.3);
  rotateY(time * 0.3);
  
  // Metallic material properties
  noStroke();
  specularMaterial(180, 190, 210);
  shininess(60);
  
  // Update and draw blob
  updateBlob(blob);
  
  // Increment time
  time += 0.02;
}

function createBlob() {
  let blob = [];
  let detail = 60; // High detail for smooth surface
  
  for (let theta = 0; theta < TWO_PI; theta += TWO_PI / detail) {
    for (let phi = 0; phi < PI; phi += PI / detail) {
      blob.push({
        theta: theta,
        phi: phi,
        baseRadius: 150
      });
    }
  }
  
  return blob;
}

function updateBlob(blob) {
  beginShape(TRIANGLE_STRIP);
  
  for (let i = 0; i < blob.length; i++) {
    let point = blob[i];
    
    // More complex noise for less predictable shape
    let noiseScale1 = 0.15;
    let noiseScale2 = 0.2;
    let noiseAmp = 80; // Increased amplitude for more dramatic deformation
    
    // Multiple noise layers for complex deformation
    let radiusNoise1 = noise(
      point.theta * noiseScale1 + time * 1.2, 
      point.phi * noiseScale1 + time * 0.7
    );
    
    let radiusNoise2 = noise(
      point.theta * noiseScale2 + time * 0.8, 
      point.phi * noiseScale2 + time * 1.5
    );
    
    // Combine noise layers for more organic movement
    let radiusNoise = (radiusNoise1 * 0.6 + radiusNoise2 * 0.4);
    
    // Calculate vertex position with noise
    let radius = point.baseRadius + radiusNoise * noiseAmp;
    
    // More extreme spherical coordinate transformation
    let x = radius * sin(point.phi) * cos(point.theta);
    let y = radius * sin(point.phi) * sin(point.theta);
    let z = radius * cos(point.phi);
    
    // Additional random distortion
    x += sin(time + point.theta) * 20;
    y += cos(time + point.phi) * 20;
    z += sin(time + point.theta * point.phi) * 20;
    
    // Normal calculation for lighting
    let nx = x / radius;
    let ny = y / radius;
    let nz = z / radius;
    
    // Add vertex with normal
    normal(nx, ny, nz);
    vertex(x, y, z);
  }
  
  endShape(CLOSE);
}

function mousePressed() {
  // Regenerate blob on click for new shape
  blob = createBlob();
}

function windowResized() {
  // Adjust canvas size when window is resized
  resizeCanvas(windowWidth, windowHeight);
}