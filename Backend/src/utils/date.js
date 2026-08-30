export const calculateLeaveDays =
    (
        startDate,
        endDate
    ) => {
        const start =
            new Date(startDate);

        const end =
            new Date(endDate);

        if (
            Number.isNaN(
                start.getTime()
            ) ||
            Number.isNaN(
                end.getTime()
            )
        ) {
            throw new Error(
                "Invalid leave dates"
            );
        }

        if (end < start) {
            throw new Error(
                "End date cannot be before start date"
            );
        }

        const milliseconds =
            end.getTime() -
            start.getTime();

        return (
            Math.floor(
                milliseconds /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            ) + 1
        );
    };