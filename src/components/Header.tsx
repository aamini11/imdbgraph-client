export default function Header(props: { text: string }) {
    return <h1 className="text-center text-6xl leading-tight">{props.text}</h1>;
}