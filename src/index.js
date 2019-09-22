const { GraphQLServer } = require('graphql-yoga');

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Full Stack Tutorial for GraphQL',
}]
let idCount = links.length;
const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: () => links,
        link: (root, {id}) => links.find(link => link.id == id)
    },
    Mutation: {
        post: (parent, args) => {
            const link = {
                id: `link-${idCount}++`,
                description: args.description,
                url: args.url,
            }
            links.push(link);
            return link;
        },

        updateLink: (parent, args) => {
            let updatedLink;

            links = links.map(link => {
                if(link.id == args.id) {
                    updatedLink = {...link, ...args};
                    return updatedLink;
                }
                return link;
            });
            return updatedLink;
        }, 

        deleteLink: (root, args) => {
            const removeIndex = links.find(item => item.id == args.id);
            const removedLink = links[removeIndex];
            links.splice(removeIndex, 1);
            return removedLink;
        }
    }
}

const server = new GraphQLServer({
    typeDefs: './schema.graphql',
    resolvers
});

server.start(() => console.log(`Server is running on http://localhost:4000`))