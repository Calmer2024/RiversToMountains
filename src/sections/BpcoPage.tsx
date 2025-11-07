// src/pages/BpcoPage.tsx
import React from 'react';
import styles from './BpcoPage.module.scss';

const BpcoPage: React.FC = () => {
  return (
    <div className={styles.bpcoPage}>
      {/* 导航栏 */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>BPCO</div>
        <ul className={styles.navLinks}>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#work">Work</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* 主视觉区域 */}
      <section id="home" className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            CREATIVE
            <br />
            DIGITAL AGENCY
          </h1>
          <p className={styles.heroSubtitle}>
            We create meaningful experiences that connect brands with people
          </p>
          <button className={styles.ctaButton}>Explore Our Work</button>
        </div>
        <div className={styles.heroBackground}></div>
      </section>

      {/* 关于我们区域 */}
      <section id="about" className={styles.about}>
        <div className={styles.container}>
          <div className={styles.aboutContent}>
            <h2 className={styles.sectionTitle}>About Us</h2>
            <p className={styles.aboutText}>
              We are a creative digital agency focused on crafting unique brand experiences. 
              Our team of designers, developers, and strategists work together to create 
              digital solutions that make a difference.
            </p>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>50+</span>
                <span className={styles.statLabel}>Projects Completed</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>15+</span>
                <span className={styles.statLabel}>Happy Clients</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>3</span>
                <span className={styles.statLabel}>Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 作品展示区域 */}
      <section id="work" className={styles.work}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Work</h2>
          <div className={styles.workGrid}>
            <div className={styles.workItem}>
              <div className={styles.workImage}></div>
              <h3>Brand Identity</h3>
              <p>Complete brand strategy and visual identity</p>
            </div>
            <div className={styles.workItem}>
              <div className={styles.workImage}></div>
              <h3>Web Development</h3>
              <p>Modern, responsive websites and web applications</p>
            </div>
            <div className={styles.workItem}>
              <div className={styles.workImage}></div>
              <h3>Digital Marketing</h3>
              <p>Strategic digital campaigns that deliver results</p>
            </div>
          </div>
        </div>
      </section>

      {/* 联系区域 */}
      <section id="contact" className={styles.contact}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Get In Touch</h2>
          <p className={styles.contactText}>
            Ready to start your project? Let's talk about how we can help.
          </p>
          <form className={styles.contactForm}>
            <input type="text" placeholder="Your Name" className={styles.formInput} />
            <input type="email" placeholder="Your Email" className={styles.formInput} />
            <textarea placeholder="Your Message" rows={5} className={styles.formTextarea}></textarea>
            <button type="submit" className={styles.submitButton}>Send Message</button>
          </form>
        </div>
      </section>

      {/* 页脚 */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>&copy; 2025 BPCO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BpcoPage;