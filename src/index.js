const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: (root, args, context, info) => {
            return context.prisma.links();
        },
        link: (root, {id}) => links.find(link => link.id == id)
    },
    Mutation: {
        post: (parent, args, context) => {
            return context.prisma.createLink({
                url: args.url,
                description: args.description,
            })
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
    resolvers,
    context: { prisma },
});

server.start(() => console.log(`Server is running on http://localhost:4000`))