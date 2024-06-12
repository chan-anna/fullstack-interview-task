const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
const request = require("request");
const { generateCsv } = require("./generate-csv");
const app = express();

app.use(bodyParser.json({ limit: "10mb" }));

app.get("/investments/:id", (req, res) => {
  const { id } = req.params;
  request.get(
    `${config.investmentsServiceUrl}/investments/${id}`,
    (e, r, investments) => {
      if (e) {
        console.error(e);
        res.send(500);
      } else {
        res.send(investments);
      }
    }
  );
});

app.get("/generate-report", async (req, res) => {
  try {
    const investmentsResponse = await fetch(
      `${config.investmentsServiceUrl}/investments`
    );

    const companiesResponse = await fetch(
      `${config.financialCompaniesUrl}/companies`
    );

    //  some sort of logging here
    //  if (!investmentsResponse.ok || !companiesResponse.ok) {
    // console.error("Error fetching data from investment or company service");
    //  }

    const investmentsData = await investmentsResponse.json();
    const companiesData = await companiesResponse.json();

    const csv = generateCsv(investmentsData, companiesData);

    await fetch(`${config.investmentsServiceUrl}/investments/export`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ csv }),
    });

    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating report");
  }
});

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err);
    process.exit(1);
  }
  console.log(`Server running on port ${config.port}`);
});
