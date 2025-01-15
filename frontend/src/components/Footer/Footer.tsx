import { Github, Linkedin } from "lucide-react";

const Footer = (): React.JSX.Element => {
  const githubLink: string = import.meta.env.VITE_GITHUB_LINK;
  const linkedin: string = import.meta.env.VITE_LINKEDIN;

  return (
    <footer className="bg-[hsl(var(--background))]">
      <div className="h-20 flex justify-center items-center text-[hsl(var(--text-color))] text-2xl max-w-7xl mx-auto border-0 rounded-none p-2">
        <div className="flex justify-between items-center w-full mx-4">
          <p>Created by Javon Jackson</p>
          <div className="flex">
            <a className="cursor-pointer" target="_blank" href={githubLink}>
              <Github className="mx-2" />
            </a>
            <a className="cursor-pointer" target="_blank" href={linkedin}>
              <Linkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
