import { useParams } from "react-router-dom";
import {
  Container,
  Owner,
  Loading,
  BackButton,
  IssuesList,
  PageActions,
  FilterButtons,
} from "./styles";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { FaArrowLeft } from "react-icons/fa";

export default function Repositorio() {
  const { name } = useParams();
  const [repositorio, setRepositorio] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterIndex, setFilterIndex] = useState(0);
  const [filters, setFilters] = useState([
    { state: "all", label: "Todas", active: true },
    { state: "open", label: "Abertas", active: false },
    { state: "closed", label: "Fechadas", active: false },
  ]);

  useEffect(() => {
    async function load() {
      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${name}`),
        api.get(`/repos/${name}/issues`, {
          params: {
            state: filters[filterIndex].state,
            per_page: 5,
          },
        }),
      ]);
      setRepositorio(repositorioData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }
    load();
  }, [name, filters, filterIndex]);

  useEffect(() => {
    async function loadIssue() {
      const response = await api.get(`/repos/${name}/issues`, {
        params: {
          state: filters[filterIndex].state,
          page,
          per_page: 5,
        },
      });
      setIssues(response.data);
    }
    loadIssue();
  }, [name, page, filters, filterIndex]);

  function handlePage(action) {
    setPage(action === "back" ? page - 1 : page + 1);
  }

  function handleFilter(index) {
    setFilterIndex(index);
  }

  if (loading) {
    return (
      <Loading>
        <h1>Carregando..</h1>
      </Loading>
    );
  }

  return (
    <Container>
      <BackButton to="/">
        <FaArrowLeft color="#000" size={30} />
      </BackButton>
      <Owner>
        <img src={repositorio.owner.avatar_url} alt={repositorio.owner.login} />
        <h1>{repositorio.name}</h1>
        <p>{repositorio.description}</p>
      </Owner>

      <IssuesList>
        <FilterButtons active={filterIndex}>
          {filters.map((filter, index) => (
            <button
              type="button"
              key={filter.label}
              onClick={() => handleFilter(index)}
            >
              {filter.label}
            </button>
          ))}
        </FilterButtons>
        {issues.map((i) => (
          <li key={String(i.id)}>
            <img src={i.user.avatar_url} alt={i.user.login} />

            <div>
              <strong>
                <a href={i.html_url}>{i.title}</a>
                <br />
                {i.labels.map((label) => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>
              <p style={{ marginTop: i.labels.length !== 0 ? "16px" : "7px" }}>
                {i.user.login}
              </p>
            </div>
          </li>
        ))}
      </IssuesList>
      <PageActions>
        <button
          type="button"
          disabled={page < 2}
          onClick={() => handlePage("back")}
        >
          Voltar
        </button>
        <button type="button" onClick={() => handlePage("next")}>
          Próxima
        </button>
      </PageActions>
    </Container>
  );
}
