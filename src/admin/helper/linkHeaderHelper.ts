/*
<https://nomanssky.social/api/v1/admin/domain_blocks?limit=25&max_id=2362>; 
rel="next", 
<https://nomanssky.social/api/v1/admin/domain_blocks?limit=25&min_id=2386>; 
rel="prev"
*/

export const getLinkQueryParams = (linkHeader: string) => {
    let next, prev: string | undefined;

    const relSplit = linkHeader.split(',');
    for (const rel of relSplit) {

        if (rel.includes('max_id')) {
            const startIndex = rel.indexOf("max_id=");
            const endIndex = rel.indexOf(">");
            next = rel.substring(startIndex, endIndex);
        }
        if (rel.includes('min_id')) {
            const startIndex = rel.indexOf("min_id=");
            const endIndex = rel.indexOf(">");
            prev = rel.substring(startIndex, endIndex);
        }
    }



    return [prev, next];
}