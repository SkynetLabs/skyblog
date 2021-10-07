export default function Footer() {
  return (
    <footer className="m-6 text-center text-sm leading-5 text-palette-200">
      <div className="inline-flex items-center">
        Open Source
        <a
          className="hover:underline inline-flex items-center ml-2"
          href="https://github.com/skynetlabs/skyblog"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="h-3 w-auto mr-1 fill-current"
            src="/logo/github.svg"
            alt="Workflow"
          />{" "}
          GitHub
        </a>
      </div>
    </footer>
  );
}
