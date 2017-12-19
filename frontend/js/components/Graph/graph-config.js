import React from 'react';

const ThemeShape = (
  <symbol viewBox="0 0 100 100" id="theme">
    <circle cx="50" cy="50" r="45"></circle>
  </symbol>
)

const EmptyShape = (
  <symbol viewBox="0 0 100 100" id="empty">
    <circle cx="50" cy="50" r="45"></circle>
  </symbol>
)

const CourseShape = (
  <symbol viewBox="0 0 100 100" id="course">
    <circle cx="50" cy="50" r="45"></circle>
  </symbol>
)

const SemesterShape = (
  <symbol viewBox="0 0 100 100" id="semester">
    <circle cx="50" cy="50" r="45"></circle>
  </symbol>
)

const YearShape = (
  <symbol viewBox="0 0 100 100" id="year">
    <circle cx="50" cy="50" r="45"></circle>
  </symbol>
)

const SpecialChildShape = (
  <symbol viewBox="0 0 100 100" id="specialChild">
    <rect x="2.5" y="0" width="95" height="97.5" fill="rgba(30, 144, 255, 0.12)"></rect>
  </symbol>
)

const EmptyEdgeShape = (
  <symbol viewBox="0 0 50 50" id="emptyEdge">
    <circle cx="25" cy="25" r="8" fill="currentColor"> </circle>
  </symbol>
)

const SpecialEdgeShape = (
  <symbol viewBox="0 0 50 50" id="specialEdge">
    <rect transform="rotate(45)"  x="25" y="-4.5" width="15" height="15" fill="currentColor"></rect>
  </symbol>
)

export default {
  NodeTypes: {
    empty: {
      typeText: "None",
      shapeId: "#empty",
      shape: EmptyShape
    },
    theme: {
      typeText: "Theme",
      shapeId: "#theme",
      shape: ThemeShape
    },
    course: {
      typeText: "Course",
      shapeId: "#course",
      shape: CourseShape
    },
    semester: {
      typeText: "Semester",
      shapeId: "#semester",
      shape: SemesterShape,
    },
    year: {
      typeText: "Year",
      shapeId: "#year",
      shape: YearShape,
    }
  }, 
  NodeSubtypes: {
    specialChild: {
      shapeId: "#specialChild",
      shape: SpecialChildShape
    }
  }, 
  EdgeTypes: {
    emptyEdge: {
      shapeId: "#emptyEdge",
      shape: EmptyEdgeShape
    },
    specialEdge: {
      shapeId: "#specialEdge",
      shape: SpecialEdgeShape
    }
  }
}