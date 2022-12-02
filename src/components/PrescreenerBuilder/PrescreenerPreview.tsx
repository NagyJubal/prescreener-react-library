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
    height: "auto",
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
  return (
    <>
      <Paper elevation={3} className={classes.previewCanvas}>
        {questionArray.map((row, index) => (
          <div key={index}>
            {row.type == "info"
              ? PreviewInfo(row as InfoNodeInterface, index)
              : ""}
            {row.type == "single"
              ? PreviewSingle(row as SingleSelectInterface, index)
              : ""}
            {<Divider />}
          </div>
        ))}
      </Paper>
    </>
  );
};

const PreviewInfo = (node: InfoNodeInterface, index: number) => {
  const classes = useStyles();
  return (
    <>
      <Grid container spacing={1} className={classes.question_container}>
        <Grid item xs={11}>
          {node.question_text}
        </Grid>
        <Grid item xs={1}>
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
        <Grid item xs={11}>
          {node.question_text}
        </Grid>
        <Grid item xs={1}>
          <EditOptions node={node} index={index} />
        </Grid>
        <Grid item xs={11}>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
          >
            {node.rows.map((row, index) => (
              <FormControlLabel
                key={index}
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
interface EditOptionsPropsInterface {
  node: SingleSelectInterface | InfoNodeInterface;
  index: number;
}
const EditOptions = (props: EditOptionsPropsInterface) => {
  const node = props.node;
  const index = props.index;
  const classes = useStyles();
  const { SetEditing, SetEditingQuestion, swapInQuestionArray } =
    useContext(AppContext);

  const editQuestion = () => {
    SetEditingQuestion({ question: node, index: index });
    node?.type == "info"
      ? SetEditing({ state: true, type: "info", editing: true })
      : SetEditing({ state: true, type: "single", editing: true });
  };

  return (
    <span className={classes.icon_container}>
      <EditIcon onClick={editQuestion} />
      <ArrowUpwardIcon onClick={() => swapInQuestionArray(index, true)} />
      <ArrowDownwardIcon onClick={() => swapInQuestionArray(index, false)} />
    </span>
  );
};
