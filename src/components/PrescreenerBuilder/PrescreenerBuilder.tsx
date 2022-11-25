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
  const [editingQuestion, SetEditingQuestion] = useState<any>({});
  const [questionArray, SetQuestionArray] = useState<
    (SingleSelectInterface | InfoNodeInterface)[]
  >([
    {
      question_id: "Q0",
      question_text: "testing Single Select",
      type: "single",
      rows: [{ label: "first", value: "1", terminate: true }],
    },
    {
      question_id: "Q1",
      question_text: "testing info Node",
      type: "info",
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
  const changeInQuestionArray = (
    question: InfoNodeInterface | SingleSelectInterface,
    index: number
  ) => {
    const myTuple: (SingleSelectInterface | InfoNodeInterface)[] = [
      ...questionArray,
    ];
    myTuple[index] = question;
    SetQuestionArray(myTuple);
  };
  const removeFromQuestionArray = (index: number) => {
    const myTuple: (SingleSelectInterface | InfoNodeInterface)[] = [
      ...questionArray,
    ];
    if (index > -1) {
      myTuple.splice(index, 1);
      for (let i = index; i < myTuple.length; i++) {
        myTuple[i].question_id = `Q${i}`;
      }
      SetQuestionArray(myTuple);
    }
  };
  const swapInQuestionArray = (index: number, up: boolean) => {
    const swapElements = (index1: number, index2: number) => {
      const myTuple: (SingleSelectInterface | InfoNodeInterface)[] = [
        ...questionArray,
      ];
      [myTuple[index1], myTuple[index2]] = [myTuple[index2], myTuple[index1]];
      SetQuestionArray(myTuple);
    };
    let index1: number;
    if (index > 0 && up) {
      index1 = index - 1;
      swapElements(index1, index);
    }
    if (index < getQuestionArrayLength() - 1 && !up) {
      index1 = index + 1;
      swapElements(index1, index);
    }
  };
  const getQuestionArrayLength = () => {
    return questionArray.length;
  };

  return (
    <AppContext.Provider
      value={{
        editing,
        SetEditing,
        editingQuestion,
        SetEditingQuestion,
        getQuestionArrayLength,
        addToQuestionArray,
        changeInQuestionArray,
        removeFromQuestionArray,
        swapInQuestionArray,
      }}
    >
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
        {editing.state && editing.type == "single" && <EditSingleSelect />}
        {editing.state && editing.type == "info" && <EditInfoNode />}
      </Grid>
    </AppContext.Provider>
  );
};

export default PrescreenerBuilder;
