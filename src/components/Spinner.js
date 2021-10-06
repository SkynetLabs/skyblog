export default function Spinner(props) {
  return (
    <div className="px-4 py-32 sm:px-0 space-y-6 text-center">
      <div className="sk-chase inline-block">
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
      </div>
      <p className="text-palette-500">{props.text}</p>
    </div>
  );
}
