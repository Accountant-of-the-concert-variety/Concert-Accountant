function Footer() {
  return (
    <footer>
      <div className="socials">
        <span className="contact">Contact Us</span>
        <ul>
          <li>Brandon Carter</li>
          <li>
            <a href="https://github.com/Brandon-E-Carter">
              <span className="sr-only" htmlFor="sociallinks">
                Github
              </span>
              <i className="fab fa-github"></i>
            </a>
          </li>

          <li>
            <a href="https://www.linkedin.com/in/brandon-carter-134950112/">
              <span className="sr-only" htmlFor="sociallinks">
                LinkedIn
              </span>
              <i class="fab fa-linkedin-in"></i>
            </a>
          </li>

          <li>Eric Howell</li>
          <li>
            <a href="https://github.com/RixTrixx">
              <span className="sr-only" htmlFor="sociallinks">
                Github
              </span>
              <i className="fab fa-github"></i>
            </a>
          </li>

          <li>
            <a href="https://www.linkedin.com/in/eric-howell-513656b9/">
              <span className="sr-only" htmlFor="sociallinks">
                LinkedIn
              </span>
              <i class="fab fa-linkedin-in"></i>
            </a>
          </li>

          <li>Saif Hussaini</li>
          <li>
            <a href="https://github.com/SSHMamba">
              <span className="sr-only" htmlFor="sociallinks">
                Github
              </span>
              <i className="fab fa-github"></i>
            </a>
          </li>

          <li>
            <a href="https://www.linkedin.com/in/saif-hussaini-04a96b202/">
              <span className="sr-only" htmlFor="sociallinks">
                LinkedIn
              </span>
              <i class="fab fa-linkedin-in"></i>
            </a>
          </li>
        </ul>
        <p>Powered by Ticketmaster&reg; API</p>
      </div>
      <div className="juno">Created at Juno College / 2021</div>
    </footer>
  );
}

export default Footer;
