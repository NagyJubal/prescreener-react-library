import React, { useState, useContext } from "react";
import { makeStyles } from "@mui/styles";
import {
  SingleSelectInterface,
  InfoNodeInterface,
  AppContext,
} from "./PrescreenerBuilder";
import { Button } from "@mui/material";
import { Paper } from "@mui/material";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import EditIcon from "@mui/icons-material/Edit";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const useStyles = makeStyles({
  previewCanvas: {
    width: "90%",
    height: "70%",
    padding: "20px",
  },
  question_container: {
    marginTop: "15px",
  },
  icon_container: {
    align: "right",
    width: "100%",
    "& > *": {
      marginRight: "2px",
      opacity: 0.5,
      border: "1px",
      borderStyle: "solid",
    },
    "& > *:hover": {
      opacity: 1,
      cursor: "pointer",
    },
  },
});

export interface PrescreenerPreviewProps {
  questionArray: (SingleSelectInterface | InfoNodeInterface)[];
}

export const PrescreenerPreview = (props: PrescreenerPreviewProps) => {
  const classes = useStyles();
  const questionArray = props.questionArray;
  const handleSave = () => {
    console.log(questionArray);
  };
  return (
    <>
      <Paper elevation={3} className={classes.previewCanvas}>
        {questionArray.map((row, index) => (
          <>
            {row.type == "info"
              ? PreviewInfo(row as InfoNodeInterface, index)
              : ""}
            {row.type == "single"
              ? PreviewSingle(row as SingleSelectInterface, index)
              : ""}
            {<Divider />}
          </>
        ))}
      </Paper>
      <div style={{ textAlign: "right" }}>
        <Button color={"primary"} onClick={handleSave} variant={"outlined"}>
          Save
        </Button>
      </div>
    </>
  );
};

const PreviewInfo = (node: InfoNodeInterface, index: number) => {
  const classes = useStyles();
  return (
    <>
      <Grid container spacing={1} className={classes.question_container}>
        <Grid item xs={10}>
          {node.question_text}
        </Grid>
        <Grid item xs={2}>
          <EditOptions node={node} index={index} />
        </Grid>
      </Grid>
    </>
  );
};

const PreviewSingle = (node: SingleSelectInterface, index: number) => {
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={10}>
          {node.question_text}
        </Grid>
        <Grid item xs={2}>
          <EditOptions node={node} index={index} />
        </Grid>
        <Grid item xs={11}>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
          >
            {node?.rows?.map((row, index) => (
              <FormControlLabel
                value={row.label}
                control={<Radio size="small" />}
                label={row.label}
              />
            ))}
          </RadioGroup>
        </Grid>
      </Grid>
    </>
  );
};

const EditOptions = (node: any, index: number) => {
  const classes = useStyles();
  const { SetEditing } = useContext(AppContext);
  const editQuestion = () => {
    SetEditing({ state: true, type: "info", editing: false });
  };
  return (
    <span className={classes.icon_container}>
      <EditIcon onClick={editQuestion} />
      <ArrowUpwardIcon />
      <ArrowDownwardIcon />
      <DeleteForeverIcon />
    </span>
  );
};
