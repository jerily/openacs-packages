
%module Mapscript

%{
/* static global copy of Tcl interp */
static Tcl_Interp *SWIG_TCL_INTERP;
%}

%init{
  Tcl_CreateNamespace(interp, SWIG_namespace, NULL, NULL);
  Tcl_PkgProvide(interp, SWIG_name, "0.1");
}

%{
#ifdef USE_NAVISERVER
#include "ns.h"
#endif
#ifdef USE_TCL_STUBS
  if (Tcl_InitStubs(interp, "8.6", 0) == NULL) {
    return TCL_ERROR;
  }
  /* save Tcl interp pointer to be used in getImageToVar() */
  SWIG_TCL_INTERP = interp;
#endif /* USE_TCL_STUBS */
#ifdef USE_NAVISERVER
NS_EXTERN int Ns_ModuleVersion = 1;
NS_EXTERN int Ns_ModuleInit(const char *server, const char *module) {
    Ns_TclRegisterTrace(server, (Ns_TclTraceProc *) SWIG_init, server, NS_TCL_TRACE_CREATE);
    return NS_OK;
}
#endif

%}

