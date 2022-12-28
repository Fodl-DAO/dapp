export const getFodlPerWeek = () => {
    return 0;

    const x = Math.abs(
        Math.ceil(
            (new Date().getTime() - new Date('2021-10-28').getTime()) /
                (7 * 24 * 60 * 60 * 1000),
        ),
    );

    return (
        (90000000 / 27114.7073085399) *
        Math.pow(x + 1, -Math.E / 10) *
        (1200 - x)
    );
};
