import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-wrapper">
      <header className="about-header">
        <h1>About Tomato.com</h1>
        <p>Your go-to platform for engaging and interactive quizzes.</p>
      </header>
      <section className="about-section">
        <div className="about-content">
          <h2>Our Story</h2>
          <p>
            Founded in 2024, Tomato.com was born out of a passion for education and technology. We set out on a mission to make learning both fun and accessible to everyone. Our quizzes are designed to challenge and entertain, helping users learn and grow with every question.
          </p>
        </div>
        <div className="about-image">
          <img src="https://via.placeholder.com/400x300" alt="Our Story" />
        </div>
      </section>
      <section className="about-section reverse">
        <div className="about-content">
          <h2>Our Values</h2>
          <ul>
            <li><strong>Innovation:</strong> We embrace the latest technology to enhance our platform.</li>
            <li><strong>Accessibility:</strong> We are dedicated to making our platform available to users of all backgrounds.</li>
            <li><strong>Fun:</strong> Learning should be enjoyable, and our quizzes make sure it is.</li>
          </ul>
        </div>
        <div className="about-image">
          <img src="https://via.placeholder.com/400x300" alt="Our Values" />
        </div>
      </section>
    </div>
  );
};

export default About;
