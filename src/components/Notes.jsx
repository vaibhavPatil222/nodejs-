import React, { useCallback, useEffect, useState } from "react";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [noteById, setNoteById] = useState({});

  console.log(notes);

  const getNotes = async () => {
    try {
      const response = await fetch("http://localhost:5000/notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addNodeHandler = useCallback(
    async (e) => {
      // const postNote = { id: Math.round(Math.random() * 9999 + 1), ...newNote };
      try {
        const response = await fetch("http://localhost:5000/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newNote),
        });
        getNotes();
      } catch (error) {
        console.error(error);
      }
    },
    [newNote]
  );

  const updateNoteHandler = useCallback( async (updatedNote) => {

      try {
        const response = await fetch("http://localhost:5000/notes", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedNote),
        });
        getNotes();
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const getNoteById = useCallback( async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/notes/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setNoteById(data);
      } catch (error) {
        console.error(error);
      }
    },[]);

  const deleteNoteById = async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/deleteNotes/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json()
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error deleting note:", errorData);
      } else {
          console.log("Note deleted successfully");
          // setNotes(data);
        getNotes();

      }
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    getNotes();
  }, [addNodeHandler]);

  const newTitleHandler = (e) => {
    setNewNote((prevState) => {
      return { ...prevState, title: e.target.value };
    });
  };

  const newContentHandler = (e) => {
    setNewNote((prevState) => {
      return { ...prevState, content: e.target.value };
    });
  };

  const updateTitleHandler = (e) => {
    setNoteById((prevState) => {
      return { ...prevState, title: e.target.value };
    });
  };

  const updateContentHandler = (e) => {
    setNoteById((prevState) => {
      return { ...prevState, content: e.target.value };
    });
  };

  const editBtnHandler = () => {
    setIsEditing((prev)=>!prev);
    isEditing && (
      updateNoteHandler(noteById)
    )
  }

  return (
    <>
      <h1>Notes</h1>

        <button
          className="btn btn-info my-2"
          type="submit"
          data-bs-toggle="modal" data-bs-target="#addNoteModal"
        >
          Add Note
        </button>
      <div className="container">
        <div className="row">
          {notes.length !== 0 ? notes.map((note, i) => {
            return (
              <div key={i} className="col-lg-3 my-2">
                <div className="card" style={{ width: "18rem" }}>
                  <div className="card-body">
                    <h5 className="card-title">
                      {note.title}
                    </h5>
                      {/* Button trigger modal */}
                    <button onClick={()=>getNoteById(note._id)} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                      View
                    </button>
                    <button onClick={()=>deleteNoteById(note._id)} type="button" className="btn btn-danger ms-2">
                      Delete
                    </button>
                  </div>
                </div>

                <div></div>
              </div>
            );
          }) : <h1>Add a note</h1>}
        </div>
      </div>
<div>

  {/* Modal */}
  <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="exampleModalLabel">Note Details</h1>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div className="modal-body">
        <h5>Id: {noteById._id}</h5>
          <h5>Title: {isEditing ? (<input className="form-control" type="text" onInput={updateTitleHandler} defaultValue={noteById.title}/>) : noteById.title}</h5>
          <h5>Content: {isEditing ? (<input className="form-control" type="text" onInput={updateContentHandler} defaultValue={noteById.content}/>) : noteById.content}</h5>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button onClick={editBtnHandler} type="button" className="btn btn-primary">{isEditing ? 'Save' : 'Edit'}</button>
        </div>
      </div>
    </div>
  </div>

  {/* Modal */}
  <div className="modal fade" id="addNoteModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="exampleModalLabel">Add Note</h1>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div className="modal-body">
        <div className="form-group mx-auto my-2">
        <label className="form-label" htmlFor="">
          New Note
        </label>
        <input
          className="form-control my-2"
          type="text"
          onInput={newTitleHandler}
          placeholder="Enter Title"
        />
        <input
          className="form-control my-2"
          type="text"
          onInput={newContentHandler}
          placeholder="Enter Content"
        />
      </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button onClick={addNodeHandler} type="button" className="btn btn-primary" data-bs-dismiss="modal">Add</button>

        </div>
      </div>
    </div>
  </div>
</div>

    </>
  );
};

export default Notes;
