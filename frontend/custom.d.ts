// CSS modules
declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}

// All Froala Editor modules
declare module 'froala-editor/*' {
    const content: any;
    export default content;
}