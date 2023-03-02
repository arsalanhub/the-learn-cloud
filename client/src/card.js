import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function OutlinedCard({ text, striked }) {

  return (
    <Box sx={{ minWidth: 275 }} draggable={true}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="div" style={{ textDecoration: striked ? "line-through" : "" }}>
            {text}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
