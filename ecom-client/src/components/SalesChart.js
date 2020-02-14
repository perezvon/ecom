import React from "react";
import { Chart } from "grommet";

const SalesChart = () => {
  return (
    <Chart
      bounds={[[0, 7], [0, 100]]}
      values={[
        { value: [7, 100], label: "one hundred" },
        { value: [6, 70], label: "seventy" },
        { value: [5, 60], label: "sixty" },
        { value: [4, 80], label: "eighty" },
        { value: [3, 40], label: "forty" },
        { value: [2, 10], label: "ten" },
        { value: [1, 30], label: "thirty" },
        { value: [0, 60], label: "sixty" }
      ]}
      aria-label="chart"
    />
  );
};

export default SalesChart;
