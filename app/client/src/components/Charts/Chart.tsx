import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  probabilities: number[];
};

const ProbabilityChart = (props: Props) => {
  const data = {
    labels: ["Contradiction", "Neutral", "Entailment"],
    datasets: [
      {
        label: "Probability",
        data: props.probabilities[0],
        // data: props.probabilities,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 1, // Since probabilities are between 0 and 1
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ProbabilityChart;
