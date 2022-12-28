import { IMarket } from '../../../interfaces/market.interface';
import { TimeRange } from '../asset-graph.component';

import { isStableCoin } from '../../../utilities/stableCoin';
import { isExchangeReverseRequired } from '../../../utilities/formatExchangeRate';
import { formatValue } from '../../../utilities/formatValue';

import {
    CHART_BG,
    CHART_BUTTON_COLOR,
    CHART_FONT_FAMILY,
    CHART_PRIMARY_COLOR,
    CHART_SECONDARY_COLOR,
    CHART_STOPS_0,
    CHART_STOPS_1,
    CHART_TEXT_COLOR,
    CHART_TEXT_TRANSFORM,
    CHART_TOOLTIP_FONT_SIZE,
    CHART_TOOLTIP_LINE_HEIGHT,
} from '../../../constants/commons';

import * as Highcharts from 'highcharts/highstock';

export const getChartOptions = (
    data: number[],
    filterDays: TimeRange,
    borrowMarket: IMarket,
    supplyMarket: IMarket,
): Highcharts.Options => {
    const seriesLineWidth = function () {
        return filterDays === TimeRange.THREE_MONTH ? 1.5 : 2;
    };

    const xAxisLabelFormatter = function () {
        const defaultLabel = this.axis.defaultLabelFormatter.call(this);
        if (filterDays === TimeRange.DAY) {
            return Highcharts.dateFormat('%H:%M', this.value as number);
        }
        return defaultLabel;
    };

    const tooltipPointFormatter = function () {
        const value = formatValue(this.y);
        const assetSymbols = getTooltipAssetSymbols(this.y);
        const tooltipPoint = `${value} ${assetSymbols[0]}/${[assetSymbols[1]]}`;
        return `<div style="color:${CHART_TEXT_COLOR}">${tooltipPoint}</div>`;
    };

    const getTooltipAssetSymbols = function (value: number) {
        const borrowSymbol = borrowMarket.assetSymbol;
        const supplySymbol = supplyMarket.assetSymbol;

        if (isStableCoin(borrowSymbol) && isStableCoin(supplySymbol)) {
            return [supplySymbol, borrowSymbol];
        }

        if (isStableCoin(borrowSymbol) || isStableCoin(supplySymbol)) {
            return isExchangeReverseRequired(value, borrowSymbol, supplySymbol)
                ? [supplySymbol, borrowSymbol]
                : [borrowSymbol, supplySymbol];
        }

        return supplyMarket.assetUsdValue > borrowMarket.assetUsdValue
            ? [borrowSymbol, supplySymbol]
            : [supplySymbol, borrowSymbol];
    };

    const tickInterval = function () {
        /**
         * Before modifying time range
         * check if it's available in options:
         * xAxis -> units[]
         */
        const hour = 1000 * 60 * 60;
        const day = hour * 24;

        if (filterDays === TimeRange.DAY) {
            return hour * 3;
        }
        if (filterDays === TimeRange.WEEK) {
            return day;
        }
        if (filterDays === TimeRange.MONTH) {
            return day * 4;
        }
        if (filterDays === TimeRange.THREE_MONTH) {
            return day * 13;
        }
        if (filterDays === TimeRange.YEAR) {
            return day * 60;
        }
        return undefined; // Default
    };

    return {
        chart: {
            renderTo: 'container',
            backgroundColor: 'transparent',
            spacing: [0, 2, 12, 2],
        },
        rangeSelector: {
            allButtonsEnabled: false,
            inputEnabled: false,
            enabled: false,
            buttonPosition: {
                align: 'right',
            },
            labelStyle: {
                display: 'none',
            },
            buttonTheme: {
                display: 'none',
                fill: 'none',
                stroke: 'none',
                'margin-top': '-50px !important',
                'stroke-width': 0,
                r: '20px',
                style: {
                    color: CHART_BUTTON_COLOR,
                    fontWeight: 'bold',
                    padding: '12px',
                    fontSize: '15px',
                },
                states: {
                    hover: {
                        fill: 'transparent',
                        style: {
                            color: CHART_TEXT_COLOR,
                        },
                    },
                    select: {
                        fill: 'transparent',
                        style: {
                            color: CHART_TEXT_COLOR,
                        },
                    },
                },
            },
        },
        credits: {
            enabled: false,
        },
        title: {
            text: '',
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: {
                    main: '%b %e',
                },
                week: {
                    main: '%b %e',
                },
                month: {
                    main: '%b %e',
                },
            },
            lineWidth: 0,
            minorGridLineWidth: 0,
            minorTickLength: 0,
            tickLength: 0,
            tickInterval: tickInterval(),
            ordinal: false,
            labels: {
                formatter: xAxisLabelFormatter,
                style: {
                    color: CHART_SECONDARY_COLOR,
                    fontFamily: CHART_FONT_FAMILY,
                    textTransform: CHART_TEXT_TRANSFORM,
                },
            },
            units: [
                ['millisecond', [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]],
                ['second', [1, 2, 5, 10, 15, 30]],
                ['minute', [1, 2, 5, 10, 15, 30]],
                ['hour', [1, 2, 3, 4, 6, 8, 12]],
                ['day', [1, 2, 3, 4, 5]],
                ['week', [1, 1.8, 2]],
                ['month', [1, 2, 3, 4, 6]],
                ['year', null],
            ],
        },
        yAxis: {
            visible: false,
        },
        navigator: {
            enabled: false,
        },
        scrollbar: {
            enabled: false,
        },
        tooltip: {
            backgroundColor: CHART_BG,
            borderColor: 'transparent',
            style: {
                color: '#fff',
                fontFamily: CHART_FONT_FAMILY,
                fontSize: CHART_TOOLTIP_FONT_SIZE,
                lineHeight: CHART_TOOLTIP_LINE_HEIGHT,
            },
            xDateFormat: '%A, %b %e, %H:%M:%S',
            pointFormatter: tooltipPointFormatter,
            shared: true,
        },
        series: [
            {
                type: 'area',
                data: data,
                showInLegend: false,
                lineColor: CHART_PRIMARY_COLOR,
                lineWidth: seriesLineWidth(),
                showInNavigator: false,
            },
        ],
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1,
                    },
                    stops: [
                        [0, CHART_STOPS_0],
                        [1, CHART_STOPS_1],
                    ],
                },
                marker: {
                    radius: 2,
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1,
                    },
                },
                dataGrouping: {
                    enabled: false,
                },
                threshold: null,
            },
        },
    };
};
