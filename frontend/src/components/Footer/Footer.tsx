import { Github, Linkedin } from "lucide-react";

const Footer = (): React.JSX.Element => {
  const githubLink: string = import.meta.env.VITE_GITHUB_LINK;
  const linkedin: string = import.meta.env.VITE_LINKEDIN;

  return (
    <footer className="bg-[hsl(var(--background))]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-center rounded-none border-0 p-2 text-2xl text-[hsl(var(--text-color))]">
        <div className="mx-4 flex w-full items-center justify-between">
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
