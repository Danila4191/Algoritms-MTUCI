import React from "react";
import { ReturnButton } from "../return-button/return-button";
import { Link } from "react-router-dom";
import styles from "./solution-layout.module.css";



export const SolutionLayout = ({
  extraClass = "",
  title,
  children,
}) => {
  return (
    <main className={`${styles.content} ${extraClass}`}>
      <div className={styles.titleBox}>
        <h1 className={`text text_type_h2 text_color_h1 ${styles.title}`}>
          МТУСИ Алгоритмы
        </h1>
      </div>
      <div className={styles.contentCard}>
        <Link className={styles.link} to="/">
          <ReturnButton extraClass={styles.returnButton} />
        </Link>
        <h3 className={`text text_type_h3 text_color_h3 ${styles.cardTitle}`}>
          {title}
        </h3>
        {children}
      </div>
    </main>
  );
};
