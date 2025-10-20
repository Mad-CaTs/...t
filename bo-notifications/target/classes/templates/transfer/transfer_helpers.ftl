<#-- Transfer-local helpers (moved from fragments to keep transfer self-contained) -->
<#function fullName first last fallback>
  <#local a = (first! "")>
  <#local b = (last! "")>
  <#local joined = ( (a + ' ' + b)?trim )>
  <#if joined?has_content>
    <#return joined />
  <#else>
    <#return (fallback! "") />
  </#if>
</#function>
