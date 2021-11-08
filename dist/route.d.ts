export default function generate(): {
    configureServer: (({ app }: {
        app: any;
    }) => Promise<void>)[];
};
