import React, { useState, createContext } from "react";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { InfoNode, EditInfoNode } from "./InfoNode";
import { SingleSelect, EditSingleSelect } from "./SingleSelect";
import { useEffect } from "react";
import { PrescreenerPreview } from "./PrescreenerPreview";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const AppContext = createContext<any | null>(null);

export interface PrescreenerBuilderProps {
  surveyId: string;
}

export interface EditingProps {
  SetEditing: Function;
}
export interface InfoNodeInterface {
  type: string;
  question_text: string;
  question_id: string;
}
export interface SingleSelectInterface {
  type: string;
  question_text: string;
  question_id: string;
  rows: { label: string; value: string; terminate: boolean }[];
}

const PrescreenerBuilder = (props: PrescreenerBuilderProps) => {
  const [editing, SetEditing] = useState({
    state: false,
    type: "none",
    editing: false,
  });
  const [questionArray, SetQuestionArray] = useState<
    (SingleSelectInterface | InfoNodeInterface)[]
  >([
    {
      question_id: "Q0",
      question_text: "testing purpose",
      type: "single",
      rows: [{ label: "first", value: "1", terminate: true }],
    },
  ]);
  const addToQuestionArray = (
    question: InfoNodeInterface | SingleSelectInterface
  ) => {
    const myTuple: (SingleSelectInterface | InfoNodeInterface)[] = [
      ...questionArray,
    ];
    myTuple.push(question);
    SetQuestionArray(myTuple);
  };
  // useEffect(() => {
  //   addToQuestionArray({ question_text: "nagymami", question_id: "q1" });
  // }, []);
  useEffect(() => {
    console.log(questionArray);
  }, [questionArray]);

  return (
    <AppContext.Provider value={{ editing, SetEditing }}>
      <Grid container spacing={1}>
        {!editing.state && (
          <>
            <Grid item xs={1.5}>
              <Item>Components</Item>
              <Item>
                <InfoNode />
              </Item>
              <Item>
                <SingleSelect />
              </Item>
            </Grid>
            <Grid item xs={10}>
              <PrescreenerPreview questionArray={questionArray} />
            </Grid>
          </>
        )}
        {editing.state && editing.type == "single" && (
          <EditSingleSelect
            addToQuestionArray={addToQuestionArray}
            index={editing.editing ? 999 : questionArray.length}
          />
        )}
        {editing.state && editing.type == "info" && (
          <EditInfoNode
            addToQuestionArray={addToQuestionArray}
            index={editing.editing ? 999 : questionArray.length}
          />
        )}
      </Grid>
    </AppContext.Provider>
  );
};

export default PrescreenerBuilder;
