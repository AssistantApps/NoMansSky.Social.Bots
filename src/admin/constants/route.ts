const genericBotParam = ':id';

export const routes = {
    home: '/',
    actualHome: '/home',
    announcements: '/announcements',
    domainBlocks: '/domainBlocks',
    util: '/util',

    genericBotParam,
    genericBot: '/bot',
    genericBotWithId: `/bot/${genericBotParam}`,

    about: '/about',
}
